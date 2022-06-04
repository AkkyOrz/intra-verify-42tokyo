# Intra-verify for 42-Tokyo

**注意: このプロジェクトは既にメンテナンスされていません**


## 想定する利用者

42-Tokyo に所属する学生

## 概要

このリポジトリは、42-Tokyo で毎日行う必要がある認証を自動化するために作成しました。

> (注意)
> 普段 Dicord を使用している IP アドレスと異なる環境からアクセスを行った場合、hCAPTCHA が起動する可能性が有ります。
> 現在のバージョンのコードでは、 hCAPTCHA による challenge が求められるケースに対応できていません。

## local で使用する場合

- 最低でも、 node, yarn, chromium のインストールが必要です(現状Linuxでのみ動作確認をしています)
- install の方法
  - node の install
    - [OS の package manager 経由](https://nodejs.dev/download/package-manager/)
    - [nvm 経由](https://github.com/nvm-sh/nvm)
    - [nodenv, anyenv 経由](https://github.com/nodenv/nodenv)
  - [yarn の install](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
  - chromium の install

### 動作を確認する

```bash
$ git clone https://github.com/AkkyOrz/intra-verify-42tokyo.git
$ cd intra-verify-42tokyo
$ cat << EOF > .env
TOKYO_42_USERNAME="sample_user"
TOKYO_42_PASSWORD="password"
DISCORD_EMAIL="example@student.42.example.fr"
DISCORD_PASSWORD="password"
EOF
$ npm install -g yarn
$ yarn
$ yarn start # headless mode
# yarn dev でブラウザが起動する
```

<!-- ## 使い方

1. このプロジェクトを fork する
2. fork したリポジトリの `Settings` > `Secrets` > `Actions secrets: New repository secret` に以下のクレデンシャル情報を追加する
   - `TOKYO_42_USERNAME`
   - `TOKYO_42_PASSWORD`
   - `DISCORD_EMAIL`
   - `DISCORD_PASSWORD`
3. `Actions` から手動で Github Actions を起動し、Success することを確認する -->

### cron で毎日決まった時刻に起動する

> (注意)
> 常時稼働しているマシンを自宅に持っている方向けです(デスクトップ PC とかでも大丈夫です)

```bash
$ crontab -e
# 04:05(JST) (UTC 19:05) に起動する場合
5 19 * * * /path/to/yarn --cwd /path/to/intra-verify-42tokyo start 2>> /path/to/error.log >> /path/to/result.log
```

うまく行かない場合はログファイルを確認してみると解決するかもしれません。

## 制約

discord の 二段階認証を有効にしている場合、このコードを利用することが出来ない可能性が有ります。

## 貢献

Issue/PR をお待ちしています。
なにか問題や質問などあれば @akito 宛にメンション・DM をしてください。
