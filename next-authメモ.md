# next-auth チュートリアル

## 今回試したいこと

next-auth を使用し、簡単な github などの Oauth を試す。
楽になるのかを蓮珠対策として施行

下記の「以下試してダメだったこと」は文字通り試してダメだったことです。
これは施行しないでください

## next-auth version 4 と 5 の違い

version4:

5 はベータ版なので本番環境でまだ使えるものではないらしいです。
・主な違い

1.version4
下記ドキュメント

> https://next-auth.js.org/
> ・セッションを取得するとき getServerSession を使用しなければならない
> ・ドキュメントが page.tsx 用

2.version5
そもそもドキュメントが違う。
書きかたなども next のバージョンによって違う(use server を使用するしないなど)

> https://authjs.dev/
> ・ auth()関数があり、これでセッション、トークンなどが取得できる

# 1.以下試してダメだったこと(1 敗)

---

next-auth メモ

現在は 15 のベータ版
今そのまま npm install next-auth をすると 15 のベータ版がインストールされる

https://github.com/nextauthjs/next-auth-example
上記がドキュメントの例題で出されているが、これをクローンして npm run dev をするとエラーがでる
理由として、環境変数を読み込んでいないかららしい
15 から auth.js というライブラリが組み込まれるようになった結果環境変数が優先されるらしい

npx auth secret

上記コマンドで生成して.env にセット、Readme にある下記コマンドを忘れずに
cp .env.local.example .env.local

## ダメな理由理由

ドキュメントが page ディレクトリのもので app のものはこれからっぽい
例の git とドキュメントがあっていない。ここが混乱原因

---

# 2.以下試してダメだったこと(1 敗)

再挑戦
今度は next-auth のものではなく、
auth.js のもの
https://authjs.dev/getting-started/installation?framework=next.js

これが今 beta 番らしく
npx create-next-app next-auth1.2
まずはプロジェクトを作成

npx auth secret
上記で環境変数

AUTH_SECRET=6j39wzEiycO1bLB0ksZi4ptXM2utKbs1/Q8WRWKYB48=

・上記の時点で UI などを自分で作らなければいけないことと下記 youtube の動画を発見し、そこの git が
公式ドキュメント UI + approuter で調整されたものなので、下記が一番楽だとこの時点で気づきました。

---

# 下記成功例

# git を使用して施行

せっかくなので、nex-auth のバージョンを分けて書きかたを変えてみます

・"next": "14.1.4"
・"next-auth": "^5.0.0-beta.15"

##　現在の問題:ドキュメントの git は app router だけどドキュメントの記述は page ディレクトリ基準なので、そのまま書き写すなどはできない

https://www.youtube.com/watch?v=2xexm8VXwj8&t=1008s

上記を主に参考にした。上記動画に貼ってある下記

https://github.com/Shin-sibainu/next-auth-app-template.git

このお方の git には上記で失敗した next-auth5 の app router 版で調整したもの、使いやすい

・auth.ts

providers→ ここで git か google かなどを決められる
providers:[Github]のように書く

callbacks も書く必要あり、jwt トークンの生成が next-auth のライブラリに含まれてるっぽさがある

\app\api\auth\[...next-auth]\route.ts
上記の route.ts に api を描けばいい感じになるらしい
ファイルが一つの場合は[...next-auth].ts でもいいです

・コールバック URL
http://localhost:3001/api/auth/callback/github

環境変数の設定 github > setting > Developer settings > OAuthApps から設定できる
AUTH_GITHUB_ID=b02b2a98d160ac808611
AUTH_GITHUB_SECRET=d828a1a4e195b2fca9c7199c134b041c086cc360

・環境変数
環境変数を設定して、auth.ts に貼り付け
providers:[Github({
clientId:process.env.AUTH_GITHUB_ID,
clientSecret:process.env.AUTH_GITHUB_SECRET
})
],
・UI
<SignIn provider="github" />
・SignIn
return (

<form
action={async () => {"use server";await signIn(provider);}} >
<Button {...props}>サインイン</Button>
</form>
);

上記にサインインの関数を追加

const session = await auth();

session で取得して
{JSON.stringify(session, null, 2)}
表示させるようにすれば見れる

# 以下「ラインでログイン」の成功例

せっかくなので、nex-auth のバージョンを分けて書きかたを変えてみます
以下参考サイト

> https://zenn.dev/hotter6163/articles/b7d2d3af91ef3a

・"next": "^13.4.6",
・"next-auth": "^4.22.1",

以下環境変数

LINE_CLIENT_ID=下記 URL のチャネル ID
LINE_CLIENT_SECRET=下記 URL のシークレット ID
NEXTAUTH_SECRET=openssl rand -base64 32 で作成したランダム文字列
NEXTAUTH_URL=http://localhost:3000

> https://developers.line.biz/console/

上記 URL にて、チャネルを作成、「ラインでログイン」項目のチャネルで簡単に作成できます。
route.ts にプロバイダーを設定
・route.ts
providers: [
LineProvider({
clientId: process.env.LINE_CLIENT_ID ?? '',
clientSecret: process.env.LINE_CLIENT_SECRET ?? '',
}),
]

上記 URL のチャネル作成した設定でコールバック URL 設定
http://localhost:3000/api/auth/callback/line

・UI
export const LoginButton: FC = () => (
<button onClick={() => signIn("line")}>LINE でログイン</button>
);

上記でできました。引き続き email アドレスは取れないので、課題です
