# URL Shortener Microservice

## 用户故事： 

- 用户在浏览器输入该地址时，把一个合法的 URL 作为参数，返回一个 JSON 格式的段地址。

- 如果用户输入的是一个无效的 URL 地址（不符合 http://www.example.com 格式）作为参数，则返回错误。

- 如果用户输入前边生成的段地址，则会重定向到相应的合法地址。

## Example creation usage:

https://fccp-short-url.herokuapp.com/new/https://www.google.com

https://fccp-short-url.herokuapp.com/new/http://foo.com:80

## Example creation output:

{"original_url":"http://foo.com:80","short_url":"https://fccp-short-url.herokuapp.com/8170"}