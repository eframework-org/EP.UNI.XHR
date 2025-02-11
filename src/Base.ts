// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { XEvent, XObject } from "ep.uni.util"
import parse from "url-parse"

/**
 * URL interface.
 *
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
 * Parses a URL.
 *
 * 解析URL。
 * 
 * @param url URL to parse; 要解析的URL。
 * @returns parsed URL object; 解析后的URL对象。
 */
export function parseUrl(url: string): IURL {
    const ret = parse(url);
    Object.assign(ret, { url });
    return ret as unknown as IURL;
}

/**
 * XMLHttpRequest response type.
 *
 * XMLHttpRequest响应类型。
 */
export type XMLHttpRequestResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text";

/**
 * XMLHttpRequest method.
 *
 * XMLHttpRequest方法。
 */
export type XMLHttpRequestMethod = "CONNECT" | "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT" | "TRACE";

/**
 * BodyInit type.
 *
 * BodyInit类型。
 */
export type BodyInit = string | Record<string, any>;

/**
 * XMLHttpRequest ready state enum.
 *
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
 * Event propagation phase enum.
 *
 * 事件传播阶段枚举。
 */
export enum Phase {
    /** No event is currently being processed. */
    /** 当前没有事件正在处理 */
    NONE,
    /** The event is being propagated through the ancestors of the target. */
    /** 事件正在通过目标的祖先对象传播 */
    CAPTURING_PHASE,
    /** The event has reached the target of the event. Event listeners registered for this phase are called at this time. If Event.bubbles is false, processing of the event ends after this phase. */
    /** 事件已到达事件的目标。为此阶段注册的事件监听器将在此时被调用。如果 Event.bubbles 为 false，则在此阶段完成后处理事件 */
    AT_TARGET,
    /** The event propagates back up the hierarchy from the parent to the containing Window. This is known as bubbling and only occurs if Event.bubbles is true. Event listeners registered for this phase are triggered during this process. */
    /** 事件以相反的顺序向上传播，通过目标的祖先，从父级开始，最终到达包含的 Window。这称为冒泡，仅在 Event.bubbles 为 true 时发生。在此过程中为此阶段注册的事件监听器将被触发 */
    BUBBLING_PHASE,
}

/**
 * Event initialization interface.
 *
 * 事件初始化接口。
 */
export interface EventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
}

/**
 * Progress event initialization interface.
 *
 * 进度事件初始化接口。
 */
export interface ProgressEventInit extends EventInit {
    lengthComputable?: boolean;
    loaded?: number;
    total?: number;
}

/**
 * Event class.
 *
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
     * Returns whether the event bubbles.
     *
     * 返回事件是否冒泡。
     */
    get bubbles(): boolean { return this.$bubbles; }
    protected $bubbles: boolean;
    cancelBubble: boolean;

    /**
     * Returns whether the event is cancelable.
     *
     * 返回事件是否可取消。
     */
    get cancelable(): boolean { return this.$cancelable; }
    protected $cancelable: boolean;

    /**
     * Returns whether the event composed through ShadowRoot.
     *
     * 返回事件是否穿过 ShadowRoot。
     */
    get composed(): boolean { return this.$composed; }
    protected $composed: boolean;

    /**
     * Returns the object whose event listeners are currently being processed.
     *
     * 返回当前正在调用其事件监听器的对象。
     */
    get currentTarget(): XMLHttpRequestEventTarget { return this.$currentTarget; }
    protected $currentTarget: XMLHttpRequestEventTarget;

    /**
     * Returns whether preventDefault() was successfully invoked.
     *
     * 返回是否成功调用了 preventDefault() 方法。
     */
    get defaultPrevented(): boolean { return this.$defaultPrevented == true; }
    protected $defaultPrevented: boolean;

    /**
     * Returns the phase of the event.
     *
     * 返回事件的阶段。
     */
    get eventPhase(): Phase { return this.$eventPhase; }
    protected $eventPhase: Phase;

    /**
     * Returns whether the event was dispatched by the user agent.
     *
     * 返回事件是否由用户代理调度。
     */
    get isTrusted(): boolean { return this.$isTrusted; }
    protected $isTrusted: boolean;

    returnValue: boolean;

    /**
     * Returns the target of the event.
     *
     * 返回事件的目标对象。
     */
    get target(): XMLHttpRequestEventTarget { return this.$target; }
    protected $target: XMLHttpRequestEventTarget;

    /**
     * Returns the timestamp of the event.
     *
     * 返回事件的时间戳。
     */
    get timeStamp(): number { return this.$timeStamp; }
    protected $timeStamp: number;

    /**
     * Returns the type of the event.
     *
     * 返回事件的类型。
     */
    get type(): string { return this.$type; }
    protected $type: string;

    /**
     * Returns the event path.
     *
     * 返回事件路径。
     */
    composedPath(): XMLHttpRequestEventTarget[] {
        return [];
    }

    /**
     * Initializes the event.
     *
     * 初始化事件。
     * 
     * @param type event type; 事件类型。
     * @param bubbles whether the event bubbles; 事件是否冒泡。
     * @param cancelable whether the event is cancelable; 事件是否可取消。
     */
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
        this.$type = type;
        this.$bubbles = bubbles;
        this.$cancelable = cancelable;
        this.$timeStamp = Date.now();
    }

    /**
     * Signals to the user agent that the event's default action should be canceled.
     *
     * 如果在 cancelable 属性值为 true 时调用，并且在为事件执行侦听器时 passive 设置为 false，则向导致事件被调度的操作发出信号，表示需要取消该操作。
     */
    preventDefault(): void {
        if (this.cancelable) {
            this.$defaultPrevented = true;
        }
    }

    /**
     * Prevents the event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents the event from reaching any other objects.
     *
     * 调用此方法可防止事件在当前侦听器运行后到达任何注册的事件侦听器，并且在树中调度时，还可防止事件到达任何其他对象。
     */
    stopImmediatePropagation(): void {
        this.$defaultPrevented = true;
        this.cancelBubble = false;
    }

    /**
     * Prevents the event from reaching any objects other than the current object.
     *
     * 在树中调度时，调用此方法可防止事件到达当前对象以外的任何对象。
     */
    stopPropagation(): void {
        if (this.$bubbles) {
            this.cancelBubble = true;
        }
    }
}

/**
 * Progress event class.
 *
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
 * XMLHttpRequest event target class.
 *
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
     * Adds an event listener.
     *
     * 添加事件监听器。
     * 
     * @param type event type; 事件类型。
     * @param listener event listener; 事件监听器。
     * @param options event listener options; 事件监听选项。
     */
    addEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
        const once = typeof options === "object" ? options?.once : options;
        this.$evt?.Reg(XObject.HashCode(type), listener, once || false);
    }

    /**
     * Removes an event listener.
     *
     * 移除事件监听器。
     * 
     * @param type event type; 事件类型。
     * @param listener event listener; 事件监听器。
     * @param options event listener options; 事件监听选项。
     */
    removeEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
        this.$evt?.Unreg(XObject.HashCode(type), listener);
    }

    /**
     * Dispatches an event.
     *
     * 派发事件。
     * 
     * @param event event object; 事件对象。
     * @returns whether the event was successfully dispatched; 是否成功派发事件。
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
 * XMLHttpRequest upload class.
 *
 * XMLHttpRequest上传类。
 */
export class XMLHttpRequestUpload extends XMLHttpRequestEventTarget { }

/**
 * Uses XMLHttpRequest (XHR) objects to interact with servers. You can retrieve data from a URL without having to do a full page refresh. This allows web pages to be updated asynchronously without interrupting the user.
 *
 * 使用 XMLHttpRequest (XHR) 对象与服务器交互。您可以从 URL 检索数据，而无需执行完整的页面刷新。这使得网页可以在不打断用户操作的情况下更新页面的一部分。
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
     * Returns the client's state.
     *
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
     * Returns the response body.
     *
     * 返回响应的主体。
     */
    get response(): any { return this.$response; }
    protected $response: any;

    /**
     * Returns the text response.
     *
     * 返回文本响应。
     * 
     * Throws "InvalidStateError" DOMException if responseType is not the empty string or "text".
     */
    get responseText(): string | null { return null; }

    /**
     * Returns the response type.
     *
     * 返回响应类型。
     * 
     * Can be set to change the response type. Values are: the empty string (default), "arraybuffer", "blob", "document", "json", and "text".
     * 
     * When set: ignored if the current global object is not a Window object.
     * 
     * When set: throws "InvalidStateError" DOMException if state is loading or done.
     * 
     * When set: throws "InvalidAccessError" DOMException if the synchronous flag is set and the current global object is a Window object.
     */
    responseType: XMLHttpRequestResponseType;
    get responseURL(): string { return null; }

    /**
     * Returns the document response.
     *
     * 返回文档响应。
     * 
     * Throws "InvalidStateError" DOMException if responseType is not the empty string or "document".
     */
    get responseXML(): string { return null; }
    get status(): number { return 0; }
    readonly statusText: string;

    /**
     * Can be set to a time in milliseconds. When set to a non-zero value, it will cause the request to terminate if it takes longer than the given time. When the time has passed and the request has not completed, and the synchronous flag is not set, a timeout event is dispatched; otherwise a "TimeoutError" DOMException is thrown (for the send() method).
     * 
     * When set: throws "InvalidAccessError" DOMException if the synchronous flag is set and the current global object is a Window object.
     */
    timeout: number;

    /**
     * Returns the associated XMLHttpRequestUpload object. It can be used to gather transmission information when data is being transferred to the server.
     *
     * 返回关联的 XMLHttpRequestUpload 对象。它可用于在将数据传输到服务器时收集传输信息。
     */
    get upload(): XMLHttpRequestUpload { return this.$upload; }
    protected $upload: XMLHttpRequestUpload;

    /**
     * True when credentials are to be included in cross-origin requests. False when credentials are to be excluded and cookies are to be ignored in the response. Defaults to false.
     * 
     * Throws "InvalidStateError" DOMException if state is not unsent or opened, or send() flag is set.
     */
    withCredentials: boolean;

    /**
     * Cancels any network activity.
     *
     * 取消任何网络活动。
     */
    abort(): void { }

    getAllResponseHeaders(): string { return ""; }

    getResponseHeader(name: string): string | null { return null; }

    /**
     * Sets the request method, request URL, and synchronous flag.
     *
     * 设置请求方法、请求 URL 和同步标志。
     * 
     * Throws "SyntaxError" DOMException if method is not a valid HTTP method or url cannot be parsed.
     * 
     * Throws "SecurityError" DOMException if method matches `CONNECT`, `TRACE`, or `TRACK` case-insensitively.
     * 
     * Throws "InvalidAccessError" DOMException if async is false, the current global object is a Window object, and timeout attribute is not zero or responseType attribute is not the empty string.
     */
    open(method: XMLHttpRequestMethod, url: string, async?: boolean, username?: string | null, password?: string | null): void { }

    /**
     * Treats the response's `Content-Type` header value as mime. (Actually does not change the header).
     *
     * 将响应的 `Content-Type` 头值视为 mime。（但实际上不会更改头）。
     * 
     * Throws "InvalidStateError" DOMException if state is loading or done.
     */
    overrideMimeType(mime: string): void {
        this.$overridedMime = mime;
    }
    protected $overridedMime: string;

    /**
     * Initiates the request. The body parameter provides the request body (if any), and is ignored if the request method is GET or HEAD.
     *
     * 发起请求。body 参数提供请求主体（如果有），如果请求方法是 GET 或 HEAD，则忽略该参数。
     * 
     * Throws "InvalidStateError" DOMException if state is not opened or send() flag is set.
     */
    send(body?: BodyInit | null): void { }

    /**
     * Combines a header into the author request headers.
     *
     * 在作者请求头中组合一个头。
     * 
     * Throws "InvalidStateError" DOMException if state is not opened or send() flag is set.
     * 
     * Throws "SyntaxError" DOMException if name is not a header name or value is not a header value.
     */
    setRequestHeader(name: string, value: string): void {
        this.$requestHeaders[name] = value;
    }

    /**
     * Starts polling.
     *
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
     * Stops polling.
     *
     * 停止轮询。
     */
    protected $stop_poll() {
        if (this.$pollTimer != null) {
            clearInterval(this.$pollTimer);
            this.$pollTimer = null;
        }
    }

    /**
     * Polling function.
     *
     * 轮询函数。
     */
    protected $tick() { }

    /**
     * Returns the progress event initialization object.
     *
     * 返回进度事件初始化对象。
     * 
     * @returns progress event initialization object; 进度事件初始化对象。
     */
    protected $get_progress(): ProgressEventInit { return {}; }

    /**
     * Dispatches an event.
     *
     * 派发事件。
     * 
     * @param type event type; 事件类型。
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
