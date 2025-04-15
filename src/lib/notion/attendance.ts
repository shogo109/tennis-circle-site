import { Client } from "@notionhq/client";
import { PageObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const ATTENDANCE_DATABASE_ID = process.env.NOTION_ATTENDANCE_DATABASE_ID || "";

export type AttendanceStatus = "going" | "not_going" | "maybe";

export interface Attendance {
  id: string;
  _id: number;
  eventDateId: string;
  userId: string;
  userName?: string;
  status: AttendanceStatus;
}

export async function getAttendancesByEventDateId(eventDateId: string): Promise<Attendance[]> {
  try {
    const response = await notion.databases.query({
      database_id: ATTENDANCE_DATABASE_ID,
      filter: {
        property: "event_date_id",
        relation: {
          contains: eventDateId,
        },
      },
    });

    return response.results
      .map((page) => {
        const pageObj = page as PageObjectResponse;
        const properties = pageObj.properties as any;

        const eventDateRelation = properties.event_date_id?.relation || [];
        const userIdRelation = properties.attendance_user_id?.relation || [];
        const attendanceStatus = properties.attendance_status?.rich_text?.[0]?.plain_text;
        const attendanceId = properties._id?.number;

        if (!attendanceStatus || attendanceId === undefined) {
          return null;
        }

        if (userIdRelation.length === 0) {
          return null;
        }

        if (!["going", "not_going", "maybe"].includes(attendanceStatus)) {
          return null;
        }

        return {
          id: page.id,
          _id: attendanceId,
          eventDateId: eventDateRelation[0]?.id || eventDateId,
          userId: userIdRelation[0]?.id || "",
          status: attendanceStatus as AttendanceStatus,
        };
      })
      .filter((attendance): attendance is Attendance => attendance !== null);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return [];
  }
}

export async function getAttendancesByEventDateIds(eventDateIds: string[]): Promise<Attendance[]> {
  try {
    const response = await notion.databases.query({
      database_id: ATTENDANCE_DATABASE_ID,
      filter: {
        or: eventDateIds.map((eventDateId) => ({
          property: "event_date_id",
          relation: {
            contains: eventDateId,
          },
        })),
      },
    });

    return response.results
      .map((page) => {
        const pageObj = page as PageObjectResponse;
        const properties = pageObj.properties as any;

        const eventDateRelation = properties.event_date_id?.relation || [];
        const userIdRelation = properties.attendance_user_id?.relation || [];
        const attendanceStatus = properties.attendance_status?.rich_text?.[0]?.plain_text;
        const attendanceId = properties._id?.number;

        if (!attendanceStatus || attendanceId === undefined) {
          return null;
        }

        if (userIdRelation.length === 0) {
          return null;
        }

        if (!["going", "not_going", "maybe"].includes(attendanceStatus)) {
          return null;
        }

        return {
          id: page.id,
          _id: attendanceId,
          eventDateId: eventDateRelation[0]?.id || "",
          userId: userIdRelation[0]?.id || "",
          status: attendanceStatus as AttendanceStatus,
        };
      })
      .filter((attendance): attendance is Attendance => attendance !== null);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return [];
  }
}

async function getMaxAttendanceId(): Promise<number> {
  try {
    const response = await notion.databases.query({
      database_id: ATTENDANCE_DATABASE_ID,
      sorts: [
        {
          property: "_id",
          direction: "descending",
        },
      ],
      page_size: 1,
    });

    if (response.results.length === 0) {
      return 0;
    }

    const page = response.results[0] as PageObjectResponse;
    const idProperty = page.properties._id as { number: number };
    return idProperty.number || 0;
  } catch (error) {
    console.error("Error getting max attendance ID:", error);
    return 0;
  }
}

export async function createOrUpdateAttendance(
  eventDateId: string,
  userId: string,
  status: AttendanceStatus
): Promise<Attendance | null> {
  try {
    const response = await notion.databases.query({
      database_id: ATTENDANCE_DATABASE_ID,
      filter: {
        and: [
          {
            property: "event_date_id",
            relation: {
              contains: eventDateId,
            },
          },
          {
            property: "attendance_user_id",
            relation: {
              contains: userId,
            },
          },
        ],
      },
    });

    if (response.results.length > 0) {
      // 既存の出欠を更新
      const page = await notion.pages.update({
        page_id: response.results[0].id,
        properties: {
          attendance_status: {
            rich_text: [
              {
                text: {
                  content: status,
                },
              },
            ],
          },
        },
      });

      const pageObj = page as PageObjectResponse;
      const properties = pageObj.properties as any;

      const eventDateRelation = properties.event_date_id?.relation || [];
      const userIdRelation = properties.attendance_user_id?.relation || [];
      const attendanceStatus = properties.attendance_status?.rich_text[0]?.plain_text;
      const attendanceId = properties._id?.number;

      if (!attendanceStatus || attendanceId === undefined) {
        console.warn(`Missing required properties for page ${page.id}`);
        return null;
      }

      return {
        id: page.id,
        _id: attendanceId,
        eventDateId: eventDateRelation[0]?.id || eventDateId,
        userId: userIdRelation[0]?.id || userId,
        status: attendanceStatus as AttendanceStatus,
      };
    } else {
      // 新規出欠を作成
      const nextId = (await getMaxAttendanceId()) + 1;

      const page = await notion.pages.create({
        parent: {
          database_id: ATTENDANCE_DATABASE_ID,
        },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: `出欠_${nextId}`,
                },
              },
            ],
          },
          _id: {
            number: nextId,
          },
          event_date_id: {
            relation: [
              {
                id: eventDateId,
              },
            ],
          },
          attendance_user_id: {
            relation: [
              {
                id: userId,
              },
            ],
          },
          attendance_status: {
            rich_text: [
              {
                text: {
                  content: status,
                },
              },
            ],
          },
        },
      });

      const pageObj = page as PageObjectResponse;
      const properties = pageObj.properties as any;

      const eventDateRelation = properties.event_date_id?.relation || [];
      const userIdRelation = properties.attendance_user_id?.relation || [];
      const attendanceStatus = properties.attendance_status?.rich_text[0]?.plain_text;
      const attendanceId = properties._id?.number;

      if (!attendanceStatus || attendanceId === undefined) {
        console.warn(`Missing required properties for page ${page.id}`);
        return null;
      }

      return {
        id: page.id,
        _id: attendanceId,
        eventDateId: eventDateRelation[0]?.id || eventDateId,
        userId: userIdRelation[0]?.id || userId,
        status: attendanceStatus as AttendanceStatus,
      };
    }
  } catch (error) {
    console.error("Error creating/updating attendance:", error);
    return null;
  }
}

export async function updateAttendance(
  eventDateId: string,
  userId: string,
  status: AttendanceStatus
): Promise<Attendance> {
  if (!process.env.NOTION_API_KEY) {
    throw new Error("Notion API key is not set");
  }
  if (!ATTENDANCE_DATABASE_ID) {
    throw new Error("Notion attendance database ID is not set");
  }

  try {
    // 既存の出欠を検索と最大IDの取得を並列実行
    const [response, maxId] = await Promise.all([
      notion.databases.query({
        database_id: ATTENDANCE_DATABASE_ID,
        filter: {
          and: [
            {
              property: "event_date_id",
              relation: {
                contains: eventDateId,
              },
            },
            {
              property: "attendance_user_id",
              relation: {
                contains: userId,
              },
            },
          ],
        },
      }),
      getMaxAttendanceId(),
    ]);

    const nextId =
      response.results.length > 0
        ? ((response.results[0] as PageObjectResponse).properties._id as { number: number }).number
        : maxId + 1;

    const properties = {
      _id: {
        number: nextId,
      },
      title: {
        title: [
          {
            text: {
              content: `出欠_${nextId}`,
            },
          },
        ],
      },
      event_date_id: {
        relation: [
          {
            id: eventDateId,
          },
        ],
      },
      attendance_user_id: {
        relation: [
          {
            id: userId,
          },
        ],
      },
      attendance_status: {
        rich_text: [
          {
            text: {
              content: status,
            },
          },
        ],
      },
    };

    const updatedPage =
      response.results.length > 0
        ? await notion.pages.update({
            page_id: response.results[0].id,
            properties,
          })
        : await notion.pages.create({
            parent: {
              database_id: ATTENDANCE_DATABASE_ID,
            },
            properties,
          });

    return {
      id: updatedPage.id,
      _id: nextId,
      eventDateId,
      userId,
      status,
    };
  } catch (error) {
    console.error("Error updating attendance in Notion:", error);
    throw new Error("Failed to update attendance");
  }
}
