# Intra-verify for 42-Tokyo

## 想定する利用者

42-Tokyo に所属する学生

## 概要

このリポジトリは、42-Tokyo で毎日行う必要がある認証を自動化するために作成した。
以下のような利点がある

- headless browser を利用することで

## 使い方

1. このプロジェクトを fork する
2. fork したリポジトリの `Settings` > `Secrets` > `Actions secrets: New repository secret` に以下のクレデンシャル情報を追加する
   - `TOKYO_42_USERNAME`
   - `TOKYO_42_PASSWORD`
   - `DISCORD_EMAIL`
   - `DISCORD_PASSWORD`
3. `Actions` から手動で Github Actions を起動し、Success することを確認する

## 制約

discord の 2 段階認証を有効にしている場合、このコードを利用することができない。

## local で使用する場合

- `.env` というファイルを作成する
- `node main.js` で実行する

`.env`

```txt
TOKYO_42_USERNAME="sample_user"
TOKYO_42_PASSWORD="password"
DISCORD_EMAIL="example@student.42.example.fr"
DISCORD_PASSWORD="password"

```

## 貢献

Issue/PR をお待ちしています。
なにか問題や質問などあれば @akito 宛にメンション・DM をしてください。
