export default function AboutPage() {
  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-16">
        {/* ヘッダー */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-tennis-court mb-6">
            Joy'n Tennis について
          </h1>
          <p className="text-gray-600 text-lg">
            テニスを通じて、楽しみながら新しい仲間との出会いを大切にしています
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8">
            {/* サークル名の由来 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-tennis-court mb-6">
                サークル名の由来
              </h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                Joy'n Tennis
                の名前には2つの意味が込められています。「JOY」は「喜び・楽しみ」を、「JOIn」は「参加する・仲間になる」を表しています。テニスを通じて楽しみながら、新しい仲間との出会いを大切にしたいという想いが込められています。
              </p>
            </div>

            {/* 活動内容 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-tennis-court mb-6">活動内容</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-tennis-court/5 rounded-xl p-5">
                  <h3 className="font-bold text-tennis-court mb-3 flex items-center gap-2">
                    <span className="text-xl">⏰</span>
                    練習について
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-tennis-court">•</span>
                      1回4時間の充実した活動
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-tennis-court">•</span>
                      練習と試合をバランスよく実施
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-tennis-court">•</span>
                      1面5～8名でたくさんボールが打てる
                    </li>
                  </ul>
                </div>
                <div className="bg-tennis-court/5 rounded-xl p-5">
                  <h3 className="font-bold text-tennis-court mb-3 flex items-center gap-2">
                    <span className="text-xl">📍</span>
                    活動場所・頻度
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-tennis-court">•</span>
                      一宮市・稲沢市を中心に活動
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-tennis-court">•</span>
                      週末を中心に練習会を開催
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-tennis-court">•</span>
                      平日夜にも不定期で練習会を実施
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* メンバー構成 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-tennis-court mb-6">
                メンバー構成
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                現在約35名のメンバーが在籍しており、20代後半から40代前半の社会人を中心に構成されています。テニス経験は初心者から元部活動経験者まで幅広く、レベルに関係なく和気あいあいとした雰囲気で活動しています。
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-tennis-court/5 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-bold text-tennis-court mb-1">メンバー数</div>
                  <div className="text-gray-600">約35名</div>
                </div>
                <div className="bg-tennis-court/5 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-bold text-tennis-court mb-1">年齢層</div>
                  <div className="text-gray-600">20代後半～40代前半</div>
                </div>
                <div className="bg-tennis-court/5 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🎾</div>
                  <div className="font-bold text-tennis-court mb-1">テニスレベル</div>
                  <div className="text-gray-600">初心者～経験者</div>
                </div>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* サークルの特徴 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-tennis-court mb-4">サークルの特徴</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-xl">🎾</span>
                    <div>
                      <h4 className="font-bold text-tennis-court mb-1">初心者歓迎</h4>
                      <p className="text-sm text-gray-600">
                        テニス経験の有無は問いません。丁寧な指導で安心して参加できます。
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl">⭐️</span>
                    <div>
                      <h4 className="font-bold text-tennis-court mb-1">充実した活動</h4>
                      <p className="text-sm text-gray-600">
                        練習と試合をバランスよく実施。技術向上と楽しさの両立を目指しています。
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl">😊</span>
                    <div>
                      <h4 className="font-bold text-tennis-court mb-1">フレンドリーな雰囲気</h4>
                      <p className="text-sm text-gray-600">
                        メンバー同士の交流を大切にし、テニス以外でも親睦を深められます。
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 参加方法 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-tennis-court mb-4">参加をお考えの方へ</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Joy'n Tennis
                  では、新しいメンバーを随時募集しています。まずは体験参加からお気軽にご参加ください。
                </p>
                <div className="space-y-3">
                  <a
                    href="/schedule"
                    className="block text-center bg-tennis-court text-white px-4 py-2 rounded-lg hover:bg-tennis-court-dark transition-colors"
                  >
                    開催予定を確認する
                  </a>
                  <a
                    href="/apply"
                    className="block text-center bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors"
                  >
                    参加を申し込む
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
