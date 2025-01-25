//-------------------------------------------------//
//                    MIT License                  //
//    Copyright (c) 2025 EFramework Organization   //
//          SEE LICENSE.md FOR MORE DETAILS        //
//-------------------------------------------------//

import HttpStatusCode from "http-status-codes"
import MIMEType from "whatwg-mimetype"
import { BodyInit, parseUrl, XMLHttpRequestBase, XMLHttpRequestMethod, XMLHttpRequestReadyState, XMLHttpRequestUpload, XMLHttpRequestEventTarget, ProgressEventInit } from '../Base'
import { IURL } from "../Base"

/**
 * XMLHttpRequest class for Unity environment.
 *
 * Unity环境下的XMLHttpRequest类。
 */
export class XMLHttpRequest extends XMLHttpRequestBase {
    /**
     * The URL of the request.
     *
     * 请求的URL。
     */
    public get url(): Readonly<IURL> { return this.$url }
    protected $url: IURL
    protected $method: XMLHttpRequestMethod
    protected $unityRequest: CS.UnityEngine.Networking.UnityWebRequest
    protected $internalRequest: CS.UnityEngine.Networking.UnityWebRequestAsyncOperation
    protected $connectionStartAt: number
    private $timeoutUntil: number

    private $progress: number
    private $status: number
    private $internalResponsHeaders: CS.System.Collections.Generic.Dictionary$2<string, string>

    /**
     * Gets the status code of the request.
     *
     * 获取请求的状态码。
     * 
     * @returns status code; 状态码。
     */
    get status(): number {
        return this.$status
    }

    /**
     * Gets the URL of the response.
     *
     * 获取响应的URL。
     * 
     * @returns response URL; 响应的URL。
     */
    get responseURL(): string {
        if (this.url) return this.url.url
        return null
    }

    /**
     * Gets the response as XML.
     *
     * 获取响应的XML。
     * 
     * @returns response XML; 响应的XML。
     */
    get responseXML(): string {
        return this.responseText
    }

    /**
     * Gets the response as text.
     *
     * 获取响应的文本。
     * 
     * @returns response text; 响应的文本。
     */
    get responseText(): string {
        if (this.$unityRequest && this.$unityRequest.downloadHandler) {
            return this.$unityRequest.downloadHandler.text
        }
        return undefined
    }

    /**
     * Gets all response headers.
     *
     * 获取所有响应头。
     * 
     * @returns all response headers; 所有响应头。
     */
    getAllResponseHeaders(): string {
        let text = ""
        if (this.$internalResponsHeaders) {
            const enumerator = this.$internalResponsHeaders.GetEnumerator()
            while (enumerator.MoveNext()) {
                text += `${enumerator.Current.Key}: ${enumerator.Current.Value}\r\n`
            }
        }
        return text
    }

    /**
     * Gets the response header with the specified name.
     *
     * 获取指定名称的响应头。
     * 
     * @param name name of the response header; 响应头的名称。
     * @returns response header value; 响应头的值。
     */
    getResponseHeader(name: string): string {
        if (this.$internalResponsHeaders) {
            if (this.$internalResponsHeaders.ContainsKey(name)) {
                return this.$internalResponsHeaders.get_Item(name)
            }
        }
        return undefined
    }

    /**
     * Initializes a new instance of the XMLHttpRequest class.
     *
     * 初始化一个新的XMLHttpRequest类实例。
     */
    constructor() {
        super()
    }

    /**
     * Initializes a request.
     *
     * 初始化请求。
     * 
     * @param method HTTP method to use, e.g., "GET", "POST", "PUT", "DELETE"; 使用的HTTP方法，例如 "GET", "POST", "PUT", "DELETE" 等。
     * @param url URL to send the request to; 发送请求的URL。
     * @param async optional boolean parameter, default is true, indicating whether to execute the operation asynchronously; 一个可选的布尔参数，默认为 true，表示是否异步执行操作。
     * @param username optional username for authentication; 一个可选的用户名，用于身份验证。
     * @param password optional password for authentication; 一个可选的密码，用于身份验证。
     */
    open(method: XMLHttpRequestMethod, url: string, async?: boolean, username?: string | null, password?: string | null): void {
        this.$url = parseUrl(url)
        if (!this.url.port) {
            this.$url.port = this.url.protocal === "https" ? 443 : 80
        }
        this.$method = method
        this.$readyState = XMLHttpRequestReadyState.UNSENT
        this.$connectionStartAt = Date.now()
    }

    /**
     * Sends the request.
     *
     * 发送请求。
     * 
     * @param body request body, can be a string, FormData, Blob, etc.; 请求的主体，可以是字符串、FormData、Blob 等。
     */
    send(body?: BodyInit | null): void {
        const requestBody = body
        switch (this.$method) {
            case "PUT":
                this.$unityRequest = CS.UnityEngine.Networking.UnityWebRequest.Put(this.$url.url, requestBody as string)
                break
            case "POST":
                // 注意：这里故意用 PUT 创建，因为用 POST 的话 Unity 会自作主张地帮你编码 body 内容
                this.$unityRequest = CS.UnityEngine.Networking.UnityWebRequest.Put(this.$url.url, requestBody as string)
                this.$unityRequest.method = this.$method
                break
            case "GET":
                this.$unityRequest = CS.UnityEngine.Networking.UnityWebRequest.Get(this.$url.url)
                break
            case "DELETE":
                this.$unityRequest = CS.UnityEngine.Networking.UnityWebRequest.Delete(this.$url.url)
                break
            default:
                this.$unityRequest = new CS.UnityEngine.Networking.UnityWebRequest(this.$url.url, this.$method)
                break
        }
        for (const key of Object.getOwnPropertyNames(this.$requestHeaders)) {
            const value = this.$requestHeaders[key]
            this.$unityRequest.SetRequestHeader(key, value)
        }
        if (typeof this.timeout === "number") {
            this.$timeoutUntil = Date.now() + this.timeout
        }
        this.$internalRequest = this.$unityRequest.SendWebRequest()
        this.$dispatch_event("loadstart");
        this.$start_poll()
    }

    /**
     * Aborts the request.
     *
     * 终止请求。
     */
    abort(): void {
        if (this.$unityRequest) {
            this.$unityRequest.Abort()
            this.$dispatch_event("abort");
            this.$stop_poll()
        }
    }

    /**
     * Returns the progress event initialization object.
     *
     * 返回进度事件初始化对象。
     * 
     * @returns progress event initialization object; 进度事件初始化对象。
     */
    protected $get_progress(): ProgressEventInit {
        return {
            lengthComputable: this.$progress !== undefined,
            loaded: this.$progress,
            total: 1
        }
    }

    /**
     * Polling function to check the status of the request.
     *
     * 轮询函数，用于检查请求的状态。
     */
    public $tick() {
        if (this.$unityRequest) {
            this.$status = Number(this.$unityRequest.responseCode) as number
            if (this.$status) {
                this.readyState = XMLHttpRequestReadyState.OPENED
            }

            const now = Date.now()
            if (this.$timeoutUntil && now > this.$timeoutUntil) {
                this.$unityRequest.Abort()
                this.$dispatch_event("timeout");
                this.$finished_load()
                this.$status = HttpStatusCode.REQUEST_TIMEOUT
                return
            }

            this.$status = Number(this.$unityRequest.responseCode) || HttpStatusCode.CONTINUE
            if (this.readyState === XMLHttpRequestReadyState.OPENED) {
                this.$internalResponsHeaders = this.$unityRequest.GetResponseHeaders()
                if (this.$internalResponsHeaders && this.$internalResponsHeaders.Count) {
                    this.readyState = XMLHttpRequestReadyState.HEADERS_RECEIVED
                }
            }

            if (this.readyState === XMLHttpRequestReadyState.HEADERS_RECEIVED && this.$status == HttpStatusCode.OK) {
                this.readyState = XMLHttpRequestReadyState.LOADING
            }

            if (this.$unityRequest.isDone || this.$unityRequest.result != CS.UnityEngine.Networking.UnityWebRequest.Result.InProgress) {
                this.$finished_load()
            } else if (this.$internalRequest) {
                const p = this.$internalRequest.progress
                if (this.$progress !== p) {
                    this.$progress = p
                    this.$dispatch_event("progress");
                }
            }
        }
    }

    /**
     * Handles the completion of the request.
     *
     * 处理请求完成。
     */
    private $finished_load() {
        this.readyState = XMLHttpRequestReadyState.DONE
        if (this.$unityRequest.isDone || this.$unityRequest.result === CS.UnityEngine.Networking.UnityWebRequest.Result.DataProcessingError) {
            this.$internalResponsHeaders = this.$unityRequest.GetResponseHeaders()
            this.$process_response()
        }
        if (this.$unityRequest.result != CS.UnityEngine.Networking.UnityWebRequest.Result.Success) {
            this.$dispatch_event("error");
        } else {
            this.$progress = 1
            this.$dispatch_event("progress");
            this.$dispatch_event("load");
        }
        this.$dispatch_event("loadend");
        this.$stop_poll()
        if (this.$unityRequest) this.$unityRequest.Dispose()
    }

    /**
     * Processes the response based on the response type.
     *
     * 根据响应类型处理响应。
     */
    protected $process_response() {
        if (this.responseType === undefined) {
            const mime = new MIMEType(this.$overridedMime || this.getResponseHeader("Content-Type") || "text/plain")
            if (mime.type === "application" && mime.subtype === "json") {
                this.responseType = "json"
            } else if (mime.type === "arraybuffer") {
                this.responseType = "arraybuffer"
            } else {
                this.responseType = "text"
            }
        }
        switch (this.responseType) {
            case "":
            case "document":
            case "text":
                this.$response = this.responseText
                break
            case "json": {
                const text = this.responseText
                if (text) {
                    try {
                        this.$response = JSON.parse(text)
                    } catch (error) {
                        this.responseType = "text"
                        this.$response = text
                    }
                } else {
                    this.$response = null
                }

            } break
            case "arraybuffer":
                this.$response = this.$unityRequest.downloadHandler ? this.$unityRequest.downloadHandler.data : null
                break
            default:
                this.$response = null
                break
        }
    }

    /**
     * Initializes the custom XMLHttpRequest and replaces the global XMLHttpRequest.
     *
     * 初始化自定义的 XMLHttpRequest 并替换全局的 XMLHttpRequest。
     * 
     * @param pollInterval polling interval time; 轮询间隔时间。
     */
    public static Initialize(pollInterval?: number) {
        if (pollInterval != null) XMLHttpRequestBase.$pollInterval = pollInterval
        else XMLHttpRequestBase.$pollInterval = CS.UnityEngine.Time.fixedDeltaTime
        if (!globalThis.XMLHttpRequestEventTarget) Object.defineProperty(globalThis, "XMLHttpRequestEventTarget", { value: XMLHttpRequestEventTarget })
        if (!globalThis.XMLHttpRequestReadyState) Object.defineProperty(globalThis, "XMLHttpRequestReadyState", { value: XMLHttpRequestReadyState })
        if (!globalThis.XMLHttpRequestUpload) Object.defineProperty(globalThis, "XMLHttpRequestUpload", { value: XMLHttpRequestUpload })
        if (!globalThis.XMLHttpRequest) Object.defineProperty(globalThis, "XMLHttpRequest", { value: XMLHttpRequest })
    }
}

XMLHttpRequest.Initialize()