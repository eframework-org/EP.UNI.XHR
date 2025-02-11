// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { XEvent, XObject } from "ep.uni.util"
import parse from "url-parse"

/**
 * URL接口。
 */
export interface IURL {
    url: string;
    hostname?: string;
    path?: string;
    port?: number;
    protocal?: string;
}

/**
 * 解析URL。
 * 
 * @param url 要解析的URL。
 * @returns 解析后的URL对象。
 */
export function parseUrl(url: string): IURL {
    const ret = parse(url);
    Object.assign(ret, { url });
    return ret as unknown as IURL;
}

/**
 * XMLHttpRequest响应类型。
 */
export type XMLHttpRequestResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text";

/**
 * XMLHttpRequest方法。
 */
export type XMLHttpRequestMethod = "CONNECT" | "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT" | "TRACE";

/**
 * BodyInit类型。
 */
export type BodyInit = string | Record<string, any>;

/**
 * XMLHttpRequest就绪状态枚举。
 */
export enum XMLHttpRequestReadyState {
    UNSENT,
    OPENED,
    HEADERS_RECEIVED,
    LOADING,
    DONE,
}

/**
 * 事件传播阶段枚举。
 */
export enum Phase {
    /** 当前没有事件正在处理 */
    NONE,
    /** 事件正在通过目标的祖先对象传播 */
    CAPTURING_PHASE,
    /** 事件已到达事件的目标。为此阶段注册的事件监听器将在此时被调用。如果 Event.bubbles 为 false，则在此阶段完成后处理事件 */
    AT_TARGET,
    /** 事件以相反的顺序向上传播，通过目标的祖先，从父级开始，最终到达包含的 Window。这称为冒泡，仅在 Event.bubbles 为 true 时发生。在此过程中为此阶段注册的事件监听器将被触发 */
    BUBBLING_PHASE,
}

/**
 * 事件初始化接口。
 */
export interface EventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
}

/**
 * 进度事件初始化接口。
 */
export interface ProgressEventInit extends EventInit {
    lengthComputable?: boolean;
    loaded?: number;
    total?: number;
}

/**
 * 事件类。
 */
export class Event {
    constructor(type: string, eventInitDict?: EventInit) {
        this.$type = type;
        if (eventInitDict) {
            this.$bubbles = eventInitDict.bubbles;
            this.$cancelable = eventInitDict.cancelable;
            this.$composed = eventInitDict.composed;
        }
    }

    /**
     * 返回事件是否冒泡。
     */
    get bubbles(): boolean { return this.$bubbles; }
    protected $bubbles: boolean;
    cancelBubble: boolean;

    /**
     * 返回事件是否可取消。
     */
    get cancelable(): boolean { return this.$cancelable; }
    protected $cancelable: boolean;

    /**
     * 返回事件是否穿过 ShadowRoot。
     */
    get composed(): boolean { return this.$composed; }
    protected $composed: boolean;

    /**
     * 返回当前正在调用其事件监听器的对象。
     */
    get currentTarget(): XMLHttpRequestEventTarget { return this.$currentTarget; }
    protected $currentTarget: XMLHttpRequestEventTarget;

    /**
     * 返回是否成功调用了 preventDefault() 方法。
     */
    get defaultPrevented(): boolean { return this.$defaultPrevented == true; }
    protected $defaultPrevented: boolean;

    /**
     * 返回事件的阶段。
     */
    get eventPhase(): Phase { return this.$eventPhase; }
    protected $eventPhase: Phase;

    /**
     * 返回事件是否由用户代理调度。
     */
    get isTrusted(): boolean { return this.$isTrusted; }
    protected $isTrusted: boolean;

    returnValue: boolean;

    /**
     * 返回事件的目标对象。
     */
    get target(): XMLHttpRequestEventTarget { return this.$target; }
    protected $target: XMLHttpRequestEventTarget;

    /**
     * 返回事件的时间戳。
     */
    get timeStamp(): number { return this.$timeStamp; }
    protected $timeStamp: number;

    /**
     * 返回事件的类型。
     */
    get type(): string { return this.$type; }
    protected $type: string;

    /**
     * 返回事件路径。
     */
    composedPath(): XMLHttpRequestEventTarget[] {
        return [];
    }

    /**
     * 初始化事件。
     * 
     * @param type 事件类型。
     * @param bubbles 事件是否冒泡。
     * @param cancelable 事件是否可取消。
     */
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
        this.$type = type;
        this.$bubbles = bubbles;
        this.$cancelable = cancelable;
        this.$timeStamp = Date.now();
    }

    /**
     * 如果在 cancelable 属性值为 true 时调用，并且在为事件执行侦听器时 passive 设置为 false，
     * 则向导致事件被调度的操作发出信号，表示需要取消该操作。
     */
    preventDefault(): void {
        if (this.cancelable) {
            this.$defaultPrevented = true;
        }
    }

    /**
     * 调用此方法可防止事件在当前侦听器运行后到达任何注册的事件侦听器，
     * 并且在树中调度时，还可防止事件到达任何其他对象。
     */
    stopImmediatePropagation(): void {
        this.$defaultPrevented = true;
        this.cancelBubble = false;
    }

    /**
     * 在树中调度时，调用此方法可防止事件到达当前对象以外的任何对象。
     */
    stopPropagation(): void {
        if (this.$bubbles) {
            this.cancelBubble = true;
        }
    }
}

/**
 * 进度事件类。
 */
export class ProgressEvent extends Event {
    get lengthComputable(): boolean { return this.$lengthComputable; }
    protected $lengthComputable: boolean;

    get loaded(): number { return this.$loaded; }
    protected $loaded: number;

    get total(): number { return this.$total; }
    protected $total: number;

    constructor(type: string, eventInitDict?: ProgressEventInit) {
        super(type, eventInitDict);
        if (eventInitDict) {
            this.$lengthComputable = eventInitDict.lengthComputable;
            this.$loaded = eventInitDict.loaded;
            this.$total = eventInitDict.total;
        }
    }
}

/**
 * XMLHttpRequest事件目标类。
 */
export class XMLHttpRequestEventTarget {
    onabort: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
    onerror: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
    onload: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
    onloadend: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
    onloadstart: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
    onprogress: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;
    ontimeout: ((this: XMLHttpRequestBase, ev: ProgressEvent) => any) | null;

    /**
     * 添加事件监听器。
     * 
     * @param type 事件类型。
     * @param listener 事件监听器。
     * @param options 事件监听选项。
     */
    addEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
        const once = typeof options === "object" ? options?.once : options;
        this.$evt?.Reg(XObject.HashCode(type), listener, once || false);
    }

    /**
     * 移除事件监听器。
     * 
     * @param type 事件类型。
     * @param listener 事件监听器。
     * @param options 事件监听选项。
     */
    removeEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
        this.$evt?.Unreg(XObject.HashCode(type), listener);
    }

    /**
     * 派发事件。
     * 
     * @param event 事件对象。
     * @returns 是否成功派发事件。
     */
    dispatchEvent(event: Event): boolean {
        if (!event || typeof event.type != "string") return true;
        event["$target"] = this;
        this.$evt?.Notify(XObject.HashCode(event.type), event);
        return true;
    }

    protected $evt: XEvent.Manager | null = null;

    constructor() {
        this.$evt = new XEvent.Manager();
    }
}

/**
 * XMLHttpRequest上传类。
 */
export class XMLHttpRequestUpload extends XMLHttpRequestEventTarget { }

/**
 * 使用 XMLHttpRequest (XHR) 对象与服务器交互。您可以从 URL 检索数据，而无需执行完整的页面刷新。
 * 这使得网页可以在不打断用户操作的情况下更新页面的一部分。
 */
export class XMLHttpRequestBase extends XMLHttpRequestEventTarget {
    onreadystatechange: ((this: XMLHttpRequestBase, ev: Event) => any) | null;

    public get url(): Readonly<IURL> { return this.$url; }
    protected $url: IURL;
    protected $method: XMLHttpRequestMethod;
    protected $requestHeaders: { [key: string]: string; } = {};
    protected $connectionStartAt: number;
    protected static $pollInterval: number = 16;
    protected $pollTimer: number | null = null;

    /**
     * 返回客户端的状态。
     */
    get readyState(): XMLHttpRequestReadyState { return this.$readyState; }
    set readyState(value: XMLHttpRequestReadyState) {
        if (value != this.$readyState) {
            this.$readyState = value;
            if (this.onreadystatechange) {
                const event = new Event("readystatechange");
                this.onreadystatechange.call(this, event);
                this.dispatchEvent(event);
            }
        }
    }

    protected $readyState: XMLHttpRequestReadyState;

    /**
     * 返回响应的主体。
     */
    get response(): any { return this.$response; }
    protected $response: any;

    /**
     * 返回文本响应。
     * 
     * 如果 responseType 不是空字符串或 "text"，则抛出 "InvalidStateError" DOMException。
     */
    get responseText(): string | null { return null; }

    /**
     * 返回响应类型。
     * 
     * 可以设置以更改响应类型。值为：空字符串（默认）、"arraybuffer"、"blob"、"document"、"json" 和 "text"。
     * 
     * 设置时：如果当前全局对象不是 Window 对象，则忽略。
     * 
     * 设置时：如果状态为 loading 或 done，则抛出 "InvalidStateError" DOMException。
     * 
     * 设置时：如果同步标志已设置且当前全局对象是 Window 对象，则抛出 "InvalidAccessError" DOMException。
     */
    responseType: XMLHttpRequestResponseType;
    get responseURL(): string { return null; }

    /**
     * 返回文档响应。
     * 
     * 如果 responseType 不是空字符串或 "document"，则抛出 "InvalidStateError" DOMException。
     */
    get responseXML(): string { return null; }
    get status(): number { return 0; }
    readonly statusText: string;

    /**
     * 可以设置为毫秒时间。当设置为非零值时，如果请求时间超过给定时间，将导致请求终止。
     * 当时间已过且请求尚未完成，且同步标志未设置时，将派发超时事件；
     * 否则将抛出 "TimeoutError" DOMException（对于 send() 方法）。
     * 
     * 设置时：如果同步标志已设置且当前全局对象是 Window 对象，则抛出 "InvalidAccessError" DOMException。
     */
    timeout: number;

    /**
     * 返回关联的 XMLHttpRequestUpload 对象。它可用于在将数据传输到服务器时收集传输信息。
     */
    get upload(): XMLHttpRequestUpload { return this.$upload; }
    protected $upload: XMLHttpRequestUpload;

    /**
     * 当在跨源请求中包含凭据时为 true。当排除凭据且在响应中忽略 cookie 时为 false。默认为 false。
     * 
     * 如果状态不是 unsent 或 opened，或已设置 send() 标志，则抛出 "InvalidStateError" DOMException。
     */
    withCredentials: boolean;

    /**
     * 取消任何网络活动。
     */
    abort(): void { }

    getAllResponseHeaders(): string { return ""; }

    getResponseHeader(name: string): string | null { return null; }

    /**
     * 设置请求方法、请求 URL 和同步标志。
     * 
     * 如果方法不是有效的 HTTP 方法或无法解析 url，则抛出 "SyntaxError" DOMException。
     * 
     * 如果方法不区分大小写匹配 `CONNECT`、`TRACE` 或 `TRACK`，则抛出 "SecurityError" DOMException。
     * 
     * 如果 async 为 false，当前全局对象是 Window 对象，且 timeout 属性不为零或 responseType 属性不为空字符串，
     * 则抛出 "InvalidAccessError" DOMException。
     */
    open(method: XMLHttpRequestMethod, url: string, async?: boolean, username?: string | null, password?: string | null): void { }

    /**
     * 将响应的 `Content-Type` 头值视为 mime。（但实际上不会更改头）。
     * 
     * 如果状态为 loading 或 done，则抛出 "InvalidStateError" DOMException。
     */
    overrideMimeType(mime: string): void {
        this.$overridedMime = mime;
    }
    protected $overridedMime: string;

    /**
     * 发起请求。body 参数提供请求主体（如果有），如果请求方法是 GET 或 HEAD，则忽略该参数。
     * 
     * 如果状态不是 opened 或已设置 send() 标志，则抛出 "InvalidStateError" DOMException。
     */
    send(body?: BodyInit | null): void { }

    /**
     * 在作者请求头中组合一个头。
     * 
     * 如果状态不是 opened 或已设置 send() 标志，则抛出 "InvalidStateError" DOMException。
     * 
     * 如果 name 不是头名称或 value 不是头值，则抛出 "SyntaxError" DOMException。
     */
    setRequestHeader(name: string, value: string): void {
        this.$requestHeaders[name] = value;
    }

    /**
     * 开始轮询。
     */
    protected $start_poll() {
        this.$stop_poll();
        // 使用 setInterval 每16ms执行一次tick
        this.$pollTimer = setInterval(() => {
            this.$tick();
        }, XMLHttpRequestBase.$pollInterval);
        // 立即执行一次tick
        this.$tick();
    }

    /**
     * 停止轮询。
     */
    protected $stop_poll() {
        if (this.$pollTimer != null) {
            clearInterval(this.$pollTimer);
            this.$pollTimer = null;
        }
    }

    /**
     * 轮询函数。
     */
    protected $tick() { }

    /**
     * 返回进度事件初始化对象。
     * 
     * @returns 进度事件初始化对象。
     */
    protected $get_progress(): ProgressEventInit { return {}; }

    /**
     * 派发事件。
     * 
     * @param type 事件类型。
     */
    protected $dispatch_event(type: keyof XMLHttpRequestEventTargetEventMap) {
        let event: Event = undefined;
        if (type === "progress") {
            const evt = new ProgressEvent("progress", this.$get_progress());
            event = evt;
        } else {
            event = new Event(type);
        }
        switch (type) {
            case "load":
                if (this.onload) this.onload.call(this, event);
                break;
            case "loadend":
                if (this.onloadend) this.onloadend.call(this, event);
                break;
            case "loadstart":
                if (this.onloadstart) this.onloadstart.call(this, event);
                break;
            case "progress":
                if (this.onprogress) this.onprogress.call(this, event);
                break;
            case "timeout":
                if (this.ontimeout) this.ontimeout.call(this, event);
                break;
            case "abort":
                if (this.onabort) this.onabort.call(this, event);
                break;
            case "error":
                if (this.onerror) this.onerror.call(this, event);
                break;
            default:
                break;
        }
        this.dispatchEvent(event);
    }
}
