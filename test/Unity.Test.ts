// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { XTest } from "ep.uni.util"
import { XMLHttpRequest } from "../src/Unity/Unity"

enum XMLHttpRequestReadyState {
    UNSENT = 0,
    OPENED = 1,
    HEADERS_RECEIVED = 2,
    LOADING = 3,
    DONE = 4
}

const file100MB = "https://speed.cloudflare.com/__down?bytes=104857600"

const baiduTest = XTest.Test("request https://www.baidu.com", () => {
    return new Promise<void>((resolve, reject) => {
        const req = new XMLHttpRequest()
        const timer = setTimeout(() => {
            reject("baiduTest error: Request timed out")
        }, 3000)
        req.onload = () => {
            clearTimeout(timer)
            if (req.response) {
                resolve()
                return
            }
            reject("baiduTest error: response is null")
        }
        req.open("GET", "https://www.baidu.com")
        req.send()
    }).catch(err => console.error("baiduTest error:" + err))
})

const readyTest = XTest.Test("ReadyState", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 3000)
        const req = new XMLHttpRequest()
        const states: XMLHttpRequestReadyState[] = []
        req.onreadystatechange = function (ev: Event) {
            states.push(this.readyState)
        }.bind(req)
        req.addEventListener("loadend", () => {
            clearTimeout(timer)
            if (states.length === 4) {
                resolve()
                return
            }
            reject("readyTest error: " + states)
        })
        req.open("GET", "https://www.baidu.com")
        req.send()
    }).catch(err => console.error("readyTest error:" + err))
})

const progressTest = XTest.Test("request progress", () => {
    return new Promise<void>((resolve, reject) => {
        const req = new XMLHttpRequest()
        const timer = setTimeout(() => {
            reject("Request timed out")
            req.abort();
        }, 3000)
        req.onprogress = (evt) => {
            if (evt.loaded > 0) {
                resolve()
                req.abort()
                clearTimeout(timer)
            }
        }
        req.open("GET", file100MB)
        req.send()
    }).catch(err => console.error("progressTest error:" + err))
})

const timeoutTest = XTest.Test("request timeout", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 2000)
        const req = new XMLHttpRequest()
        req.timeout = 50
        req.ontimeout = () => {
            clearTimeout(timer)
            resolve()
        }
        req.open("GET", file100MB)
        req.send()
    }).catch(err => console.error("timeoutTest error:" + err))
})

const httpErrTest = XTest.Test("HTTP error", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 3000)
        const req = new XMLHttpRequest()
        req.onerror = () => {
            clearTimeout(timer)
            if (req.status > 400 && req.response) {
                resolve()
            } else {
                reject()
            }
        }
        req.open("GET", "http://www.example.org/example.txt")
        req.send()
    }).catch(err => console.error("HTTPErrTest error:" + err))
})

const loadStartTest = XTest.Test("loadstart", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 3000)
        const req = new XMLHttpRequest()
        req.onloadstart = () => {
            resolve()
            clearTimeout(timer)
        }
        req.onload = () => {
            req.abort()
        }
        req.open("GET", "https://www.baidu.com")
        req.send()
    }).catch(err => console.error("loadStartTest error:" + err))
})

const abortTest = XTest.Test("abort", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 2000)
        const req = new XMLHttpRequest()
        req.onabort = () => {
            resolve()
            clearTimeout(timer)
        }
        req.open("GET", file100MB)
        req.send()
        setTimeout(() => req.abort(), 100)
    }).catch(err => console.error("abortTest error:" + err))
})

const decodeTest = XTest.Test("application/json to object", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 3000)
        const req = new XMLHttpRequest()
        req.onloadend = function (evt) {
            clearTimeout(timer)
            if (this.response && typeof (this.response) === "object") {
                resolve()
            } else {
                reject()
            }
        }.bind(req)
        req.open("GET", "https://postman-echo.com/get?foo1=bar1&foo2=bar2")
        req.send()
    }).catch(err => console.error("decodeTest error:" + err))
})

const headerTest = XTest.Test("custom Header", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 3000)
        const req = new XMLHttpRequest()
        req.onloadend = function (evt) {
            clearTimeout(timer)
            if (this.response && typeof (this.response) === "object" && this.response.headers["x-tiny"] === "good luck") {
                resolve()
            } else {
                reject()
            }
        }.bind(req)
        req.setRequestHeader("x-tiny", "good luck")
        req.open("GET", "https://postman-echo.com/get")
        req.send()
    }).catch(err => console.error("headerTest error:" + err))
})

const postJsonTest = XTest.Test("POST JSON object", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 3000)
        const req = new XMLHttpRequest()
        req.onload = function (evt) {
            clearTimeout(timer)
            if (typeof (this.response) === "object") {
                if (this.response.data && this.response.data.hello === "world" && this.response.args.foo === "bar") {
                    resolve()
                } else {
                    reject()
                }
            } else {
                reject()
            }
        }.bind(req)
        req.open("POST", "https://postman-echo.com/post?foo=bar")
        req.setRequestHeader("Content-Type", "application/json")
        req.send(JSON.stringify({ "hello": "world" }))
    }).catch(err => console.error("postJsonTest error:" + err))
})

const postFormTest = XTest.Test("POST Form", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 3000)
        const req = new XMLHttpRequest()
        req.onload = function (evt) {
            clearTimeout(timer)
            if (typeof (this.response) === "object") {
                if (this.response.form && this.response.form.hello === "world" && this.response.form.foo === "bar") {
                    resolve()
                } else {
                    reject()
                }
            } else {
                reject()
            }
        }.bind(req)
        req.open("POST", "https://postman-echo.com/post")
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        req.send(`hello=world&foo=bar`)
    }).catch(err => console.error("postFormTest error:" + err))
})

const getBufferTest = XTest.Test("GET image arrayBuffer", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 5000)
        const req = new XMLHttpRequest()
        req.onload = function (evt) {
            clearTimeout(timer)
            if (this.response.Length > 0) {
                resolve()
            }
        }.bind(req)
        req.responseType = "arraybuffer"
        req.open("GET", "https://cloud.fanyu.com/images/telephone.png")
        req.send(`hello=world&foo=bar`)
    }).catch(err => {
        console.error(err)
        return Promise.reject()
    }).catch(err => console.error("getBufferTest error:" + err))
})

const putBufferTest = XTest.Test("PUT ArrayBuffer", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject("Request timed out")
        }, 5000);

        const req = new XMLHttpRequest()
        const PNG = [0x50, 0x4E, 0x47]
        const view = new Uint8Array(PNG.length)
        for (let i = 0; i < PNG.length; i++) {
            view[i] = PNG[i]
        }
        const buffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);

        req.onload = function (evt) {
            clearTimeout(timer);
            if (this.response && typeof this.response === "object") {
                const body = this.response.body;
                if (typeof body === "string" && body.length === PNG.length) {
                    for (let i = 0; i < PNG.length; i++) {
                        if (PNG[i] !== body.charCodeAt(i)) {
                            reject("Data mismatch")
                            return
                        }
                    }
                    resolve()
                } else {
                    reject("Invalid response body")
                }
            } else {
                reject("Invalid response")
            }
        }.bind(req)

        req.open("PUT", "https://echo.zuplo.io/")
        req.setRequestHeader("Content-Type", "application/octet-stream")
        const uint8Array = new Uint8Array(buffer);
        const str = String.fromCharCode.apply(null, uint8Array);
        req.send(str)
    }).catch(err => console.error("putBufferTest error:" + err))
})

const errorCodeTest = XTest.Test("Status Code 404", () => {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(reject, 3000)
        const req = new XMLHttpRequest()
        req.onloadend = function (evt) {
            clearTimeout(timer)
            if (this.status === 404) {
                resolve()
            } else {
                reject()
            }
        }.bind(req)
        req.open("GET", "https://postman-echo.com/get233")
        req.send()
    }).catch(err => console.error("errorCodeTest error:" + err))
})

export const TestUnityXHR = XTest.Test("Test Unity XMLHttpRequet", async () => {
    // 可能会因为网络问题导致测试失败，有异常可以多试几次
    await baiduTest()
    await readyTest()
    await progressTest()
    await timeoutTest()
    await httpErrTest()
    await abortTest()
    await decodeTest()
    await headerTest()
    await postJsonTest()
    await postFormTest()
    await getBufferTest()
    await errorCodeTest()
    await loadStartTest()
    await putBufferTest()
})