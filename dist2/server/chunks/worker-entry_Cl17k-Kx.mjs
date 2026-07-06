globalThis.process ??= {};
globalThis.process.env ??= {};
import { EventEmitter } from "node:events";
import { Writable } from "node:stream";
import "cloudflare:workers";
import { d as defineMiddleware, Q as NOOP_MIDDLEWARE_HEADER, p as s, A as AstroError, S as EndpointDidNotReturnAResponse, T as REROUTABLE_STATUS_CODES, V as REROUTE_DIRECTIVE_HEADER, W as Renderer, X as markHTMLString, Y as isPropagatingHint, Z as getPropagationHint$1, $ as MissingMediaQueryDirective, a0 as NoMatchingImport, a1 as escapeHTML, a2 as bufferPropagatedHead, a3 as isHeadAndContent, a4 as isRenderTemplateResult, a5 as OnlyResponseCanBeReturned, a6 as isPromise, a7 as promiseWithResolvers, a8 as encoder, a9 as ResponseSentError, aa as chunkToByteArray, ab as chunkToString, ac as chunkToByteArrayOrString, ad as toAttributeString, ae as renderSlotToString, m as maybeRenderHead, af as containsServerDirective, F as Fragment, ag as renderChild, ah as clsx, ai as renderSlots, aj as ServerIslandComponent, ak as createAstroComponentInstance, al as NoMatchingRenderer, am as formatList, an as NoClientOnlyHint, ao as internalSpreadAttributes, ap as voidElementNames, r as renderTemplate, c as createRenderInstruction, aq as renderElement$1, ar as SlotString, as as mergeSlotInstructions, at as HTMLString, au as isHTMLString, av as isRenderInstruction, aw as isAstroComponentInstance, ax as isRenderInstance, ay as renderCspContent, az as isNode, aA as isDeno, a as addAttribute, aB as decryptString, aC as createSlotValueFromString, aD as DEFAULT_404_COMPONENT, aE as DEFAULT_404_ROUTE, aF as default404Instance, aG as removeTrailingForwardSlash, aH as getParams, aI as prependForwardSlash, aJ as decodeKey, aK as UnableToLoadLogger, aL as RouteCache, s as sequence, aM as ActionNotFoundError, aN as ReservedSlotName, aO as pipelineSymbol, aP as shouldAppendForwardSlash, aQ as REDIRECT_STATUS_CODES, aR as ActionsReturnedInvalidDataError, aS as ROUTE_TYPE_HEADER, aT as appendForwardSlash, aU as i18nNoLocaleFoundInPath, aV as MiddlewareNoDataOrNextCalled, aW as MiddlewareNotAResponse, aX as CacheNotEnabled, aY as ASTRO_ERROR_HEADER, aZ as REWRITE_DIRECTIVE_HEADER_KEY, a_ as REWRITE_DIRECTIVE_HEADER_VALUE, a$ as collapseDuplicateSlashes, b0 as ForbiddenRewrite, b1 as copyRequest, b2 as setOriginPathname, b3 as isRoute404, b4 as isRoute500, z as joinPaths, b5 as collapseDuplicateLeadingSlashes, b6 as originPathnameSymbol, b7 as generateCspDigest, b8 as ASTRO_GENERATOR, b9 as PrerenderClientAddressNotAvailable, ba as ClientAddressNotAvailable, bb as StaticClientAddressNotAvailable, bc as routeHasHtmlExtension, bd as getCustom404Route, be as appSymbol, bf as getProps, bg as fetchStateSymbol, bh as AstroResponseHeadersReassigned, bi as responseSentSymbol$1, bj as getOriginPathname, bk as LocalsReassigned, bl as INTERNAL_RESPONSE_HEADERS, bm as escape, bn as isInternalPath, bo as collapseDuplicateTrailingSlashes, bp as hasFileExtension, bq as removeLeadingForwardSlash, br as getRouteGenerator, bs as SessionStorageInitError, bt as SessionStorageSaveError, bu as LocalsNotAnObject, bv as clientAddressSymbol, bw as fileExtension, bx as slash, by as routeIsRedirect, bz as routeIsFallback, bA as getFallbackRoute, bB as findRouteToRewrite, bC as AstroUserError } from "./sequence_CNN-ZGRA.mjs";
const NOOP_ACTIONS_MOD = {
  server: {}
};
const FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
];
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url, isPrerendered } = context;
    if (isPrerendered) {
      return next();
    }
    if (SAFE_METHODS.includes(request.method)) {
      return next();
    }
    const isSameOrigin = request.headers.get("origin") === url.origin;
    const hasContentType2 = request.headers.has("content-type");
    if (hasContentType2) {
      const formLikeHeader = hasFormLikeHeader(request.headers.get("content-type"));
      if (formLikeHeader && !isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    } else {
      if (!isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    }
    return next();
  });
}
function hasFormLikeHeader(contentType) {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) {
      if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) {
        return true;
      }
    }
  }
  return false;
}
const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};
const RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
const RedirectSinglePageBuiltModule = {
  page: () => Promise.resolve(RedirectComponentInstance),
  onRequest: (_, next) => next()
};
async function renderEndpoint(mod, context, isPrerendered, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  let handler = mod[method] ?? mod["ALL"];
  if (!handler && method === "HEAD" && mod["GET"]) {
    handler = mod["GET"];
  }
  if (isPrerendered && !["GET", "HEAD"].includes(method)) {
    logger.warn(
      "router",
      `${url.pathname} ${s.bold(
        method
      )} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`
    );
  }
  if (handler === void 0) {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error(
      "router",
      `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`
    );
    return new Response(null, { status: 500 });
  }
  let response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) {
    throw new AstroError(EndpointDidNotReturnAResponse);
  }
  if (REROUTABLE_STATUS_CODES.includes(response.status)) {
    try {
      response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
    } catch (err) {
      if (err.message?.includes("immutable")) {
        response = new Response(response.body, response);
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
      } else {
        throw err;
      }
    }
  }
  if (method === "HEAD") {
    return new Response(null, response);
  }
  return response;
}
const AstroJSX = "astro:jsx";
const Empty = /* @__PURE__ */ Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string") return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child)) return;
    if (!("slot" in child.props)) return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  } else if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child)) return child;
      if (!("slot" in child.props)) return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string") return markHTMLString(child);
  if (Array.isArray(child)) return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props)) return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props = {}, key) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  return isPropagatingHint(getPropagationHint(result, factory));
}
function getPropagationHint(result, factory) {
  return getPropagationHint$1(result, factory);
}
const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  // Actually means Array
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10,
  Infinity: 11
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      }
      if (value === Number.POSITIVE_INFINITY) {
        return [PROP_TYPE.Infinity, 1];
      }
      if (value === Number.NEGATIVE_INFINITY) {
        return [PROP_TYPE.Infinity, -1];
      }
      if (value === void 0) {
        return [PROP_TYPE.Value];
      }
      return [PROP_TYPE.Value, value];
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}
const transitionDirectivesToCopyOnIsland = Object.freeze([
  "data-astro-transition-scope",
  "data-astro-transition-persist",
  "data-astro-transition-persist-props"
]);
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        // This is a special prop added to prove that the client hydration method
        // was added statically.
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d) => `client:${d}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer: renderer2, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer2.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer2.clientEntrypoint.toString())
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}
const DOCTYPE_EXP = /<!doctype html/i;
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response) return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e) {
          if (AstroError.is(e) && !e.loc) {
            e.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) {
      throw new AstroError({
        ...OnlyResponseCanBeReturned,
        message: OnlyResponseCanBeReturned.message(
          route?.route,
          typeof factoryResult
        ),
        location: {
          file: route?.component
        }
      });
    }
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return factoryResult;
}
async function bufferHeadContent(result) {
  await bufferPropagatedHead(result);
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error2 = null;
  let next = null;
  const buffer2 = [];
  let renderingComplete = false;
  const iterator = {
    async next() {
      if (result.cancelled) return { done: true, value: void 0 };
      if (next !== null) {
        await next.promise;
      } else if (!renderingComplete && !buffer2.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) {
        next = promiseWithResolvers();
      }
      if (error2) {
        throw error2;
      }
      let length = 0;
      let stringToEncode = "";
      for (let i = 0, len = buffer2.length; i < len; i++) {
        const bufferEntry = buffer2[i];
        if (typeof bufferEntry === "string") {
          const nextIsString = i + 1 < len && typeof buffer2[i + 1] === "string";
          stringToEncode += bufferEntry;
          if (!nextIsString) {
            const encoded = encoder.encode(stringToEncode);
            length += encoded.length;
            stringToEncode = "";
            buffer2[i] = encoded;
          } else {
            buffer2[i] = "";
          }
        } else {
          length += bufferEntry.length;
        }
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i = 0, len = buffer2.length; i < len; i++) {
        const item = buffer2[i];
        if (item === "") {
          continue;
        }
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer2.length = 0;
      const returnValue = {
        // The iterator is done when rendering has finished
        // and there are no more chunks to return.
        done: length === 0 && renderingComplete,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer2.push(encoder.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArrayOrString(result, chunk);
      if (bytes.length > 0) {
        buffer2.push(bytes);
        next?.resolve();
      } else if (buffer2.length > 0) {
        next?.resolve();
      }
    }
  };
  const renderResult = toPromise(() => templateResult.render(destination));
  renderResult.catch((err) => {
    error2 = err;
  }).finally(() => {
    renderingComplete = true;
    next?.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function toPromise(fn) {
  try {
    const result = fn();
    return isPromise(result) ? result : Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}
function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement$1(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}
const needsHeadRenderingSymbol = /* @__PURE__ */ Symbol.for("astro.needsHeadRendering");
const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
const clientOnlyValues = /* @__PURE__ */ new Set(["solid-js", "react", "preact", "vue", "svelte"]);
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
const ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
const ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers: renderers2, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers2.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer2;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer2 = renderers2.find(({ name }) => name === rendererName);
    }
    if (!renderer2) {
      let error2;
      for (const r of renderers2) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children, metadata)) {
            renderer2 = r;
            break;
          }
        } catch (e) {
          error2 ??= e;
        }
      }
      if (!renderer2 && error2) {
        throw error2;
      }
    }
    if (!renderer2 && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement$1(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        renderer2 = renderers2.find(
          ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
        );
      }
    }
    if (!renderer2 && validRenderers.length === 1) {
      renderer2 = validRenderers[0];
    }
    if (!renderer2) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer2 = renderers2.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
    if (!renderer2 && metadata.hydrateArgs) {
      const rendererName = metadata.hydrateArgs;
      if (typeof rendererName === "string") {
        renderer2 = renderers2.find(({ name }) => name === rendererName);
      }
    }
  }
  if (!renderer2) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else {
        throw new AstroError({
          ...NoClientOnlyHint,
          message: NoClientOnlyHint.message(metadata.displayName),
          hint: NoClientOnlyHint.hint(
            probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
          )
        });
      }
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer2 = matchingRenderers[0];
        ({ html, attrs } = await renderer2.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.
3. If using multiple JSX frameworks at the same time (e.g. React + Preact), pass the correct \`include\`/\`exclude\` options to integrations.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      performance.now();
      ({ html, attrs } = await renderer2.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
    }
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props,
      true,
      Tag
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response) return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer2?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer2?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer: renderer2, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer2?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${escapeHTML(key)}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${escapeHTML(key)}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer2?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer2.name,
            render: renderer2.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement$1("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag)) return tag;
  return tag.trim().split(unsafe)[0].trim();
}
function renderFragmentComponent(result, slots = {}) {
  const slot = slots?.default;
  const preRendered = slot?.(result);
  return {
    render(destination) {
      if (preRendered == null) return;
      return renderChild(destination, preRendered);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    const serverIslandComponent = new ServerIslandComponent(result, props, slots, displayName);
    result._metadata.propagators.add(serverIslandComponent);
    return serverIslandComponent;
  }
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    render(destination) {
      return instance.render(destination);
    }
  };
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Component.catch(handleCancellation).then((x) => {
      return renderComponent(result, displayName, x, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e) {
    if (result.cancelled)
      return {
        render() {
        }
      };
    throw e;
  }
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response) return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    if (containsServerDirective(props)) {
      await bufferHeadContent(result);
    }
    await renderInstance.render(destination);
  } catch (e) {
    if (AstroError.is(e) && !e.loc) {
      e.setLocation({
        file: route?.component
      });
    }
    throw e;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}
const ClientOnlyPlaceholder$1 = "astro-client-only";
const hasTriedRenderComponentSymbol = /* @__PURE__ */ Symbol("hasTriedRenderComponent");
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode): {
      const renderedItems = await Promise.all(vnode.map((v) => renderJSX(result, v)));
      let instructions = null;
      let content = "";
      for (const item of renderedItems) {
        if (item instanceof SlotString) {
          content += item;
          instructions = mergeSlotInstructions(instructions, item);
        } else {
          content += item;
        }
      }
      if (instructions) {
        return markHTMLString(new SlotString(content, instructions));
      }
      return markHTMLString(content);
    }
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case isAstroComponentFactory(vnode.type): {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        const str = await renderComponentToString(
          result,
          vnode.type.name,
          vnode.type,
          props,
          slots
        );
        const html = markHTMLString(str);
        return html;
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder$1 && !vnode.type.includes("-")):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props && !isCustomElement) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          delete vnode.props[hasTriedRenderComponentSymbol];
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.[AstroJSX] || !output2) {
            return await renderJSXVNode(result, output2);
          } else {
            return;
          }
        } else {
          vnode.props[hasTriedRenderComponentSymbol] = true;
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      const isCustomElement = typeof vnode.type === "string" && vnode.type.includes("-");
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value?.["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0) return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder$1 && vnode.props["client:only"]) {
        output = await renderComponentToString(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToString(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children === "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren$1(tag, children))}</${tag}>`
    )}`
  );
}
function prerenderElementChildren$1(tag, children) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return markHTMLString(children);
  } else {
    return children;
  }
}
const ClientOnlyPlaceholder = "astro-client-only";
function renderJSXToQueue(vnode, result, queue, pool, stack, parent, metadata) {
  if (vnode instanceof HTMLString) {
    const html = vnode.toString();
    if (html.trim() === "") return;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "string") {
    const node = pool.acquire("text", vnode);
    node.content = vnode;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "number" || typeof vnode === "boolean") {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  if (vnode == null || vnode === false) {
    return;
  }
  if (Array.isArray(vnode)) {
    for (let i = vnode.length - 1; i >= 0; i = i - 1) {
      stack.push({ node: vnode[i], parent, metadata });
    }
    return;
  }
  if (!isVNode(vnode)) {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  handleVNode(vnode, result, queue, pool, stack, parent, metadata);
}
function handleVNode(vnode, result, queue, pool, stack, parent, metadata) {
  if (!vnode.type) {
    throw new Error(
      `Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  if (vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment")) {
    stack.push({ node: vnode.props?.children, parent, metadata });
    return;
  }
  if (isAstroComponentFactory(vnode.type)) {
    const factory = vnode.type;
    let props = {};
    let slots = {};
    for (const [key, value] of Object.entries(vnode.props ?? {})) {
      if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
        slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
      } else {
        props[key] = value;
      }
    }
    const displayName = metadata?.displayName || factory.name || "Anonymous";
    const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
    const queueNode = pool.acquire("component");
    queueNode.instance = instance;
    queue.nodes.push(queueNode);
    return;
  }
  if (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder) {
    renderHTMLElement(vnode, result, queue, pool, stack, parent, metadata);
    return;
  }
  if (typeof vnode.type === "function") {
    if (vnode.props?.["server:root"]) {
      const output3 = vnode.type(vnode.props ?? {});
      stack.push({ node: output3, parent, metadata });
      return;
    }
    const output2 = vnode.type(vnode.props ?? {});
    stack.push({ node: output2, parent, metadata });
    return;
  }
  const output = renderJSX(result, vnode);
  stack.push({ node: output, parent, metadata });
}
function renderHTMLElement(vnode, _result, queue, pool, stack, parent, metadata) {
  const tag = vnode.type;
  const { children, ...props } = vnode.props ?? {};
  const attrs = spreadAttributes(props);
  const isVoidElement = (children == null || children === "") && voidElementNames.test(tag);
  if (isVoidElement) {
    const html = `<${tag}${attrs}/>`;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  const openTag = `<${tag}${attrs}>`;
  const openTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(openTag) : markHTMLString(openTag);
  stack.push({ node: openTagHtml, parent, metadata });
  if (children != null && children !== "") {
    const processedChildren = prerenderElementChildren(tag, children, queue.htmlStringCache);
    stack.push({ node: processedChildren, parent, metadata });
  }
  const closeTag = `</${tag}>`;
  const closeTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(closeTag) : markHTMLString(closeTag);
  stack.push({ node: closeTagHtml, parent, metadata });
}
function prerenderElementChildren(tag, children, htmlStringCache) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return htmlStringCache ? htmlStringCache.getOrCreate(children) : markHTMLString(children);
  }
  return children;
}
async function buildRenderQueue(root, result, pool) {
  const queue = {
    nodes: [],
    result,
    pool,
    htmlStringCache: result._experimentalQueuedRendering?.htmlStringCache
  };
  const stack = [{ node: root, parent: null }];
  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) {
      continue;
    }
    let { node, parent } = item;
    if (isPromise(node)) {
      try {
        const resolved = await node;
        stack.push({ node: resolved, parent, metadata: item.metadata });
      } catch (error2) {
        throw error2;
      }
      continue;
    }
    if (node == null || node === false) {
      continue;
    }
    if (typeof node === "string") {
      const queueNode = pool.acquire("text", node);
      queueNode.content = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "number" || typeof node === "boolean") {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (node instanceof SlotString) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isVNode(node)) {
      renderJSXToQueue(node, result, queue, pool, stack, parent, item.metadata);
      continue;
    }
    if (Array.isArray(node)) {
      for (const n of node) {
        stack.push({ node: n, parent, metadata: item.metadata });
      }
      continue;
    }
    if (isRenderInstruction(node)) {
      const queueNode = pool.acquire("instruction");
      queueNode.instruction = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderTemplateResult(node)) {
      const htmlParts = node["htmlParts"];
      const expressions = node["expressions"];
      if (htmlParts[0]) {
        const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[0]) : markHTMLString(htmlParts[0]);
        stack.push({
          node: htmlString,
          parent,
          metadata: item.metadata
        });
      }
      for (let i = 0; i < expressions.length; i = i + 1) {
        stack.push({ node: expressions[i], parent, metadata: item.metadata });
        if (htmlParts[i + 1]) {
          const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[i + 1]) : markHTMLString(htmlParts[i + 1]);
          stack.push({
            node: htmlString,
            parent,
            metadata: item.metadata
          });
        }
      }
      continue;
    }
    if (isAstroComponentInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isAstroComponentFactory(node)) {
      const factory = node;
      const props = item.metadata?.props || {};
      const slots = item.metadata?.slots || {};
      const displayName = item.metadata?.displayName || factory.name || "Anonymous";
      const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
      const queueNode = pool.acquire("component");
      queueNode.instance = instance;
      if (isAPropagatingComponent(result, factory)) {
        try {
          const returnValue = await instance.init(result);
          if (isHeadAndContent(returnValue) && returnValue.head) {
            result._metadata.extraHead.push(returnValue.head);
          }
        } catch (error2) {
          throw error2;
        }
      }
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "object" && Symbol.iterator in node) {
      const items = Array.from(node);
      for (const iterItem of items) {
        stack.push({ node: iterItem, parent, metadata: item.metadata });
      }
      continue;
    }
    if (typeof node === "object" && Symbol.asyncIterator in node) {
      try {
        const items = [];
        for await (const asyncItem of node) {
          items.push(asyncItem);
        }
        for (const iterItem of items) {
          stack.push({ node: iterItem, parent, metadata: item.metadata });
        }
      } catch (error2) {
        throw error2;
      }
      continue;
    }
    if (node instanceof Response) {
      const queueNode = pool.acquire("html-string", "");
      queueNode.html = "";
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = String(node);
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
    } else {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
    }
  }
  queue.nodes.reverse();
  return queue;
}
async function renderQueue(queue, destination) {
  const result = queue.result;
  const pool = queue.pool;
  const cache = queue.htmlStringCache;
  let batchBuffer = "";
  let i = 0;
  while (i < queue.nodes.length) {
    const node = queue.nodes[i];
    try {
      if (canBatch(node)) {
        const batchStart = i;
        while (i < queue.nodes.length && canBatch(queue.nodes[i])) {
          batchBuffer += renderNodeToString(queue.nodes[i]);
          i = i + 1;
        }
        if (batchBuffer) {
          const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
          destination.write(htmlString);
          batchBuffer = "";
        }
        if (pool) {
          for (let j = batchStart; j < i; j++) {
            pool.release(queue.nodes[j]);
          }
        }
      } else {
        await renderNode(node, destination, result);
        if (pool) {
          pool.release(node);
        }
        i = i + 1;
      }
    } catch (error2) {
      throw error2;
    }
  }
  if (batchBuffer) {
    const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
    destination.write(htmlString);
  }
}
function canBatch(node) {
  return node.type === "text" || node.type === "html-string";
}
function renderNodeToString(node) {
  switch (node.type) {
    case "text":
      return node.content ? escapeHTML(node.content) : "";
    case "html-string":
      return node.html || "";
    case "component":
    case "instruction": {
      return "";
    }
  }
}
async function renderNode(node, destination, result) {
  const cache = result._experimentalQueuedRendering?.htmlStringCache;
  switch (node.type) {
    case "text": {
      if (node.content) {
        const escaped = escapeHTML(node.content);
        const htmlString = cache ? cache.getOrCreate(escaped) : markHTMLString(escaped);
        destination.write(htmlString);
      }
      break;
    }
    case "html-string": {
      if (node.html) {
        const htmlString = cache ? cache.getOrCreate(node.html) : markHTMLString(node.html);
        destination.write(htmlString);
      }
      break;
    }
    case "instruction": {
      if (node.instruction) {
        destination.write(node.instruction);
      }
      break;
    }
    case "component": {
      if (node.instance) {
        let componentHtml = "";
        const componentDestination = {
          write(chunk) {
            if (chunk instanceof Response) return;
            componentHtml += chunkToString(result, chunk);
          }
        };
        await node.instance.render(componentDestination);
        if (componentHtml) {
          destination.write(componentHtml);
        }
      }
      break;
    }
  }
}
async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
    const pageProps = { ...props ?? {}, "server:root": true };
    let str;
    if (result._experimentalQueuedRendering && result._experimentalQueuedRendering.enabled) {
      let vnode = await componentFactory(pageProps);
      if (componentFactory["astro:html"] && typeof vnode === "string") {
        vnode = markHTMLString(vnode);
      }
      const queue = await buildRenderQueue(
        vnode,
        result,
        result._experimentalQueuedRendering.pool
      );
      let html = "";
      let renderedFirst = false;
      const destination = {
        write(chunk) {
          if (chunk instanceof Response) return;
          if (!renderedFirst && !result.partial) {
            renderedFirst = true;
            const chunkStr = String(chunk);
            if (!/<!doctype html/i.test(chunkStr)) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              html += doctype;
            }
          }
          html += chunkToString(result, chunk);
        }
      };
      await renderQueue(queue, destination);
      str = html;
    } else {
      str = await renderComponentToString(
        result,
        componentFactory.name,
        componentFactory,
        pageProps,
        {},
        true,
        route
      );
    }
    const bytes = encoder.encode(str);
    const headers2 = new Headers([
      ["Content-Type", "text/html"],
      ["Content-Length", bytes.byteLength.toString()]
    ]);
    if (result.shouldInjectCspMetaTags && (result.cspDestination === "header" || result.cspDestination === "adapter")) {
      headers2.set("content-security-policy", renderCspContent(result));
    }
    return new Response(bytes, {
      headers: headers2,
      status: result.response.status
    });
  }
  result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }
  if (body instanceof Response) return body;
  const init = result.response;
  const headers = new Headers(init.headers);
  if (result.shouldInjectCspMetaTags && result.cspDestination === "header" || result.cspDestination === "adapter") {
    headers.set("content-security-policy", renderCspContent(result));
  }
  if (!streaming && typeof body === "string") {
    body = encoder.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  let status = init.status;
  let statusText = init.statusText;
  if (route?.route === "/404") {
    status = 404;
    if (statusText === "OK") {
      statusText = "Not Found";
    }
  } else if (route?.route === "/500") {
    status = 500;
    if (statusText === "OK") {
      statusText = "Internal Server Error";
    }
  }
  if (status) {
    return new Response(body, { ...init, headers, status, statusText });
  } else {
    return new Response(body, { ...init, headers });
  }
}
function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true, _name);
  }
  return markHTMLString(output);
}
async function readBodyWithLimit(request, limit) {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(contentLength) && contentLength > limit) {
      throw new BodySizeLimitError(limit);
    }
  }
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > limit) {
        throw new BodySizeLimitError(limit);
      }
      chunks.push(value);
    }
  }
  const buffer2 = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer2.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer2;
}
class BodySizeLimitError extends Error {
  limit;
  constructor(limit) {
    super(`Request body exceeds the configured limit of ${limit} bytes`);
    this.name = "BodySizeLimitError";
    this.limit = limit;
  }
}
function getPattern(segments, base, addTrailingSlash) {
  const pathname = segments.map((segment) => {
    if (segment.length === 1 && segment[0].spread) {
      return "(?:\\/(.*?))?";
    } else {
      return "\\/" + segment.map((part) => {
        if (part.spread) {
          return "(.*?)";
        } else if (part.dynamic) {
          return "([^/]+?)";
        } else {
          return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
      }).join("");
    }
  }).join("");
  const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
  let initial = "\\/";
  if (addTrailingSlash === "never" && base !== "/" && pathname !== "") {
    initial = "";
  }
  return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
  if (addTrailingSlash === "always") {
    return "\\/$";
  }
  if (addTrailingSlash === "never") {
    return "$";
  }
  return "\\/?$";
}
const SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
const SERVER_ISLAND_COMPONENT = "_server-islands.astro";
function badRequest(reason) {
  return new Response(null, {
    status: 400,
    statusText: "Bad request: " + reason
  });
}
const DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024;
async function getRequestData(request, bodySizeLimit = DEFAULT_BODY_SIZE_LIMIT) {
  switch (request.method) {
    case "GET": {
      const url = new URL(request.url);
      const params = url.searchParams;
      if (!params.has("s") || !params.has("e") || !params.has("p")) {
        return badRequest("Missing required query parameters.");
      }
      const encryptedSlots = params.get("s");
      return {
        encryptedComponentExport: params.get("e"),
        encryptedProps: params.get("p"),
        encryptedSlots
      };
    }
    case "POST": {
      try {
        const body = await readBodyWithLimit(request, bodySizeLimit);
        const raw = new TextDecoder().decode(body);
        const data = JSON.parse(raw);
        if (Object.hasOwn(data, "slots") && typeof data.slots === "object") {
          return badRequest("Plaintext slots are not allowed. Slots must be encrypted.");
        }
        if (Object.hasOwn(data, "componentExport") && typeof data.componentExport === "string") {
          return badRequest(
            "Plaintext componentExport is not allowed. componentExport must be encrypted."
          );
        }
        return data;
      } catch (e) {
        if (e instanceof BodySizeLimitError) {
          return new Response(null, {
            status: 413,
            statusText: e.message
          });
        }
        if (e instanceof SyntaxError) {
          return badRequest("Request format is invalid.");
        }
        throw e;
      }
    }
    default: {
      return new Response(null, { status: 405 });
    }
  }
}
function createEndpoint(manifest2) {
  const page = async (result) => {
    const params = result.params;
    if (!params.name) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request"
      });
    }
    const componentId = params.name;
    const data = await getRequestData(result.request, manifest2.serverIslandBodySizeLimit);
    if (data instanceof Response) {
      return data;
    }
    const serverIslandMappings = await manifest2.serverIslandMappings?.();
    const serverIslandMap = await serverIslandMappings?.serverIslandMap;
    let imp = serverIslandMap?.get(componentId);
    if (!imp) {
      return new Response(null, {
        status: 404,
        statusText: "Not found"
      });
    }
    const key = await manifest2.key;
    let componentExport;
    try {
      componentExport = await decryptString(
        key,
        data.encryptedComponentExport,
        `export:${componentId}`
      );
    } catch (_e) {
      return badRequest("Encrypted componentExport value is invalid.");
    }
    const encryptedProps = data.encryptedProps;
    let props = {};
    if (encryptedProps !== "") {
      try {
        const propString = await decryptString(key, encryptedProps, `props:${componentId}`);
        props = JSON.parse(propString);
      } catch (_e) {
        return badRequest("Encrypted props value is invalid.");
      }
    }
    let decryptedSlots = {};
    const encryptedSlots = data.encryptedSlots;
    if (encryptedSlots !== "") {
      try {
        const slotsString = await decryptString(key, encryptedSlots, `slots:${componentId}`);
        decryptedSlots = JSON.parse(slotsString);
      } catch (_e) {
        return badRequest("Encrypted slots value is invalid.");
      }
    }
    const componentModule = await imp();
    let Component = componentModule[componentExport];
    const slots = {};
    for (const prop in decryptedSlots) {
      slots[prop] = createSlotValueFromString(decryptedSlots[prop]);
    }
    result.response.headers.set("X-Robots-Tag", "noindex");
    if (isAstroComponentFactory(Component)) {
      const ServerIsland = Component;
      Component = function(...args) {
        return ServerIsland.apply(this, args);
      };
      Object.assign(Component, ServerIsland);
      Component.propagation = "self";
    }
    return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
  };
  page.isAstroComponentFactory = true;
  const instance = {
    default: page,
    partial: true
  };
  return instance;
}
function createDefaultRoutes(manifest2) {
  const root = new URL(manifest2.rootDir);
  return [
    {
      instance: default404Instance,
      matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
      route: DEFAULT_404_ROUTE.route,
      component: DEFAULT_404_COMPONENT
    },
    {
      instance: createEndpoint(manifest2),
      matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
      route: SERVER_ISLAND_ROUTE,
      component: SERVER_ISLAND_COMPONENT
    }
  ];
}
function ensure404Route(manifest2) {
  if (!manifest2.routes.some((route) => route.route === "/404")) {
    manifest2.routes.push(DEFAULT_404_ROUTE);
  }
  return manifest2;
}
function routeComparator(a, b) {
  const commonLength = Math.min(a.segments.length, b.segments.length);
  for (let index = 0; index < commonLength; index++) {
    const aSegment = a.segments[index];
    const bSegment = b.segments[index];
    const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
    const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
    if (aIsStatic && bIsStatic) {
      const aContent = aSegment.map((part) => part.content).join("");
      const bContent = bSegment.map((part) => part.content).join("");
      if (aContent !== bContent) {
        return aContent.localeCompare(bContent);
      }
    }
    if (aIsStatic !== bIsStatic) {
      return aIsStatic ? -1 : 1;
    }
    const aAllDynamic = aSegment.every((part) => part.dynamic);
    const bAllDynamic = bSegment.every((part) => part.dynamic);
    if (aAllDynamic !== bAllDynamic) {
      return aAllDynamic ? 1 : -1;
    }
    const aHasSpread = aSegment.some((part) => part.spread);
    const bHasSpread = bSegment.some((part) => part.spread);
    if (aHasSpread !== bHasSpread) {
      return aHasSpread ? 1 : -1;
    }
  }
  const aLength = a.segments.length;
  const bLength = b.segments.length;
  if (aLength !== bLength) {
    const aEndsInRest = a.segments.at(-1)?.some((part) => part.spread);
    const bEndsInRest = b.segments.at(-1)?.some((part) => part.spread);
    if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
      if (aLength > bLength && aEndsInRest) {
        return 1;
      }
      if (bLength > aLength && bEndsInRest) {
        return -1;
      }
    }
    return aLength > bLength ? -1 : 1;
  }
  if (a.type === "endpoint" !== (b.type === "endpoint")) {
    return a.type === "endpoint" ? -1 : 1;
  }
  return a.route.localeCompare(b.route);
}
class Router {
  #routes;
  #base;
  #baseWithoutTrailingSlash;
  #buildFormat;
  #trailingSlash;
  constructor(routes, options) {
    this.#routes = [...routes].sort(routeComparator);
    this.#base = normalizeBase(options.base);
    this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
    this.#buildFormat = options.buildFormat;
    this.#trailingSlash = options.trailingSlash;
  }
  /**
   * Match an input pathname against the route list.
   * If allowWithoutBase is true, a non-base-prefixed path is still considered.
   */
  match(inputPathname, { allowWithoutBase = false } = {}) {
    const normalized = getRedirectForPathname(inputPathname);
    if (normalized.redirect) {
      return { type: "redirect", location: normalized.redirect, status: 301 };
    }
    if (this.#base !== "/") {
      const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
      if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) {
        return { type: "redirect", location: baseWithSlash, status: 301 };
      }
      if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) {
        return { type: "redirect", location: this.#baseWithoutTrailingSlash, status: 301 };
      }
    }
    const baseResult = stripBase(
      normalized.pathname,
      this.#base,
      this.#baseWithoutTrailingSlash,
      this.#trailingSlash
    );
    if (!baseResult) {
      if (!allowWithoutBase) {
        return { type: "none", reason: "outside-base" };
      }
    }
    let pathname = baseResult ?? normalized.pathname;
    if (this.#buildFormat === "file") {
      pathname = normalizeFileFormatPathname(pathname);
    }
    const route = this.#routes.find((candidate) => {
      if (candidate.pattern.test(pathname)) return true;
      return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
    });
    if (!route) {
      return { type: "none", reason: "no-match" };
    }
    const params = getParams(route, pathname);
    return { type: "match", route, params, pathname };
  }
  /**
   * Returns all routes that match the given pathname, in priority order.
   * Used when the first match (e.g. a prerendered route) cannot serve
   * the request and subsequent matches need to be tried.
   */
  matchAll(inputPathname, { allowWithoutBase = false } = {}) {
    const normalized = getRedirectForPathname(inputPathname);
    if (normalized.redirect) {
      return [];
    }
    const baseResult = stripBase(
      normalized.pathname,
      this.#base,
      this.#baseWithoutTrailingSlash,
      this.#trailingSlash
    );
    if (!baseResult && !allowWithoutBase) {
      return [];
    }
    let pathname = baseResult ?? normalized.pathname;
    if (this.#buildFormat === "file") {
      pathname = normalizeFileFormatPathname(pathname);
    }
    return this.#routes.filter((candidate) => {
      if (candidate.pattern.test(pathname)) return true;
      return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
    });
  }
}
function normalizeBase(base) {
  if (!base) return "/";
  if (base === "/") return base;
  return prependForwardSlash(base);
}
function getRedirectForPathname(pathname) {
  let value = prependForwardSlash(pathname);
  if (value.startsWith("//")) {
    const collapsed = `/${value.replace(/^\/+/, "")}`;
    return { pathname: value, redirect: collapsed };
  }
  return { pathname: value };
}
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
  if (base === "/") return pathname;
  const baseWithSlash = `${baseWithoutTrailingSlash}/`;
  if (pathname === baseWithoutTrailingSlash || pathname === base) {
    return trailingSlash === "always" ? null : "/";
  }
  if (pathname === baseWithSlash) {
    return trailingSlash === "never" ? null : "/";
  }
  if (pathname.startsWith(baseWithSlash)) {
    return pathname.slice(baseWithoutTrailingSlash.length);
  }
  return null;
}
function normalizeFileFormatPathname(pathname) {
  if (pathname.endsWith("/index.html")) {
    const trimmed = pathname.slice(0, -"/index.html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  if (pathname.endsWith(".html")) {
    const trimmed = pathname.slice(0, -".html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  return pathname;
}
function deserializeManifest(serializedManifest, routesList) {
  const routes = [];
  if (serializedManifest.routes) {
    for (const serializedRoute of serializedManifest.routes) {
      routes.push({
        ...serializedRoute,
        routeData: deserializeRouteData(serializedRoute.routeData)
      });
      const route = serializedRoute;
      route.routeData = deserializeRouteData(serializedRoute.routeData);
    }
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    rootDir: new URL(serializedManifest.rootDir),
    srcDir: new URL(serializedManifest.srcDir),
    publicDir: new URL(serializedManifest.publicDir),
    outDir: new URL(serializedManifest.outDir),
    cacheDir: new URL(serializedManifest.cacheDir),
    buildClientDir: new URL(serializedManifest.buildClientDir),
    buildServerDir: new URL(serializedManifest.buildServerDir),
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    key
  };
}
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
    // This pattern is serialized from Astro's own route manifest.
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin,
    distURL: rawRouteData.distURL
  };
}
function deserializeRouteInfo(rawRouteInfo) {
  return {
    styles: rawRouteInfo.styles,
    file: rawRouteInfo.file,
    links: rawRouteInfo.links,
    scripts: rawRouteInfo.scripts,
    routeData: deserializeRouteData(rawRouteInfo.routeData)
  };
}
class NodePool {
  textPool = [];
  htmlStringPool = [];
  componentPool = [];
  instructionPool = [];
  maxSize;
  enableStats;
  stats = {
    acquireFromPool: 0,
    acquireNew: 0,
    released: 0,
    releasedDropped: 0
  };
  /**
   * Creates a new object pool for queue nodes.
   *
   * @param maxSize - Maximum number of nodes to keep in the pool (default: 1000).
   *   The cap is shared across all typed sub-pools.
   * @param enableStats - Enable statistics tracking (default: false for performance)
   */
  constructor(maxSize = 1e3, enableStats = false) {
    this.maxSize = maxSize;
    this.enableStats = enableStats;
  }
  /**
   * Acquires a queue node from the pool or creates a new one if the pool is empty.
   * Pops from the type-specific sub-pool to reuse an existing object when available.
   *
   * @param type - The type of queue node to acquire
   * @param content - Optional content to set on the node (for text or html-string types)
   * @returns A queue node ready to be populated with data
   */
  acquire(type, content) {
    const pooledNode = this.popFromTypedPool(type);
    if (pooledNode) {
      if (this.enableStats) {
        this.stats.acquireFromPool = this.stats.acquireFromPool + 1;
      }
      this.resetNodeContent(pooledNode, type, content);
      return pooledNode;
    }
    if (this.enableStats) {
      this.stats.acquireNew = this.stats.acquireNew + 1;
    }
    return this.createNode(type, content);
  }
  /**
   * Creates a new node of the specified type with the given content.
   * Helper method to reduce branching in acquire().
   */
  createNode(type, content = "") {
    switch (type) {
      case "text":
        return { type: "text", content };
      case "html-string":
        return { type: "html-string", html: content };
      case "component":
        return { type: "component", instance: void 0 };
      case "instruction":
        return { type: "instruction", instruction: void 0 };
    }
  }
  /**
   * Pops a node from the type-specific sub-pool.
   * Returns undefined if the sub-pool for the requested type is empty.
   */
  popFromTypedPool(type) {
    switch (type) {
      case "text":
        return this.textPool.pop();
      case "html-string":
        return this.htmlStringPool.pop();
      case "component":
        return this.componentPool.pop();
      case "instruction":
        return this.instructionPool.pop();
    }
  }
  /**
   * Resets the content/value field on a reused pooled node.
   * The type discriminant is already correct since we pop from the matching sub-pool.
   */
  resetNodeContent(node, type, content) {
    switch (type) {
      case "text":
        node.content = content ?? "";
        break;
      case "html-string":
        node.html = content ?? "";
        break;
      case "component":
        node.instance = void 0;
        break;
      case "instruction":
        node.instruction = void 0;
        break;
    }
  }
  /**
   * Returns the total number of nodes across all typed sub-pools.
   */
  totalPoolSize() {
    return this.textPool.length + this.htmlStringPool.length + this.componentPool.length + this.instructionPool.length;
  }
  /**
   * Releases a queue node back to the pool for reuse.
   * If the pool is at max capacity, the node is discarded (will be GC'd).
   *
   * @param node - The node to release back to the pool
   */
  release(node) {
    if (this.totalPoolSize() >= this.maxSize) {
      if (this.enableStats) {
        this.stats.releasedDropped = this.stats.releasedDropped + 1;
      }
      return;
    }
    switch (node.type) {
      case "text":
        node.content = "";
        this.textPool.push(node);
        break;
      case "html-string":
        node.html = "";
        this.htmlStringPool.push(node);
        break;
      case "component":
        node.instance = void 0;
        this.componentPool.push(node);
        break;
      case "instruction":
        node.instruction = void 0;
        this.instructionPool.push(node);
        break;
    }
    if (this.enableStats) {
      this.stats.released = this.stats.released + 1;
    }
  }
  /**
   * Releases all nodes in an array back to the pool.
   * This is a convenience method for releasing multiple nodes at once.
   *
   * @param nodes - Array of nodes to release
   */
  releaseAll(nodes) {
    for (const node of nodes) {
      this.release(node);
    }
  }
  /**
   * Clears all typed sub-pools, discarding all cached nodes.
   * This can be useful if you want to free memory after a large render.
   */
  clear() {
    this.textPool.length = 0;
    this.htmlStringPool.length = 0;
    this.componentPool.length = 0;
    this.instructionPool.length = 0;
  }
  /**
   * Gets the current total number of nodes across all typed sub-pools.
   * Useful for monitoring pool usage and tuning maxSize.
   *
   * @returns Number of nodes currently available in the pool
   */
  size() {
    return this.totalPoolSize();
  }
  /**
   * Gets pool statistics for debugging.
   *
   * @returns Pool usage statistics including computed metrics
   */
  getStats() {
    return {
      ...this.stats,
      poolSize: this.totalPoolSize(),
      maxSize: this.maxSize,
      hitRate: this.stats.acquireFromPool + this.stats.acquireNew > 0 ? this.stats.acquireFromPool / (this.stats.acquireFromPool + this.stats.acquireNew) * 100 : 0
    };
  }
  /**
   * Resets pool statistics.
   */
  resetStats() {
    this.stats = {
      acquireFromPool: 0,
      acquireNew: 0,
      released: 0,
      releasedDropped: 0
    };
  }
}
class HTMLStringCache {
  cache = /* @__PURE__ */ new Map();
  maxSize;
  constructor(maxSize = 1e3) {
    this.maxSize = maxSize;
    this.warm(COMMON_HTML_PATTERNS);
  }
  /**
   * Get or create an HTMLString for the given content.
   * If cached, the existing object is returned and moved to end (most recently used).
   * If not cached, a new HTMLString is created, cached, and returned.
   *
   * @param content - The HTML string content
   * @returns HTMLString object (cached or newly created)
   */
  getOrCreate(content) {
    const cached = this.cache.get(content);
    if (cached) {
      this.cache.delete(content);
      this.cache.set(content, cached);
      return cached;
    }
    const htmlString = new HTMLString(content);
    this.cache.set(content, htmlString);
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== void 0) {
        this.cache.delete(firstKey);
      }
    }
    return htmlString;
  }
  /**
   * Get current cache size
   */
  size() {
    return this.cache.size;
  }
  /**
   * Pre-warms the cache with common HTML patterns.
   * This ensures first-render cache hits for frequently used tags.
   *
   * @param patterns - Array of HTML strings to pre-cache
   */
  warm(patterns) {
    for (const pattern of patterns) {
      if (!this.cache.has(pattern)) {
        this.cache.set(pattern, new HTMLString(pattern));
      }
    }
  }
  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }
}
const COMMON_HTML_PATTERNS = [
  // Structural elements
  "<div>",
  "</div>",
  "<span>",
  "</span>",
  "<p>",
  "</p>",
  "<section>",
  "</section>",
  "<article>",
  "</article>",
  "<header>",
  "</header>",
  "<footer>",
  "</footer>",
  "<nav>",
  "</nav>",
  "<main>",
  "</main>",
  "<aside>",
  "</aside>",
  // List elements
  "<ul>",
  "</ul>",
  "<ol>",
  "</ol>",
  "<li>",
  "</li>",
  // Void/self-closing elements
  "<br>",
  "<hr>",
  "<br/>",
  "<hr/>",
  // Heading elements
  "<h1>",
  "</h1>",
  "<h2>",
  "</h2>",
  "<h3>",
  "</h3>",
  "<h4>",
  "</h4>",
  // Inline elements
  "<a>",
  "</a>",
  "<strong>",
  "</strong>",
  "<em>",
  "</em>",
  "<code>",
  "</code>",
  // Common whitespace
  " ",
  "\n"
];
const FORBIDDEN_PATH_KEYS = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.destination;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(s.bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return s.red(prefix.join(" "));
  }
  if (level === "warn") {
    return s.yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return s.dim(prefix[0]);
  }
  return s.dim(prefix[0]) + " " + s.blue(prefix.splice(1).join(" "));
}
class AstroLogger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  setDestination(destination) {
    this.options.destination = destination;
  }
  /**
   * It calls the `close` function of the provided destination, if it exists.
   */
  close() {
    if (this.options.destination.close) {
      this.options.destination.close();
    }
  }
  /**
   * It calls the `flush` function of the provided destination, if it exists.
   */
  flush() {
    if (this.options.destination.flush) {
      this.options.destination.flush();
    }
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
  /**
   * It calls the `flush` function of the provided destination, if it exists.
   */
  flush() {
    if (this.options.destination.flush) {
      this.options.destination.flush();
    }
  }
  /**
   * It calls the `close` function of the provided destination, if it exists.
   */
  close() {
    if (this.options.destination.close) {
      this.options.destination.close();
    }
  }
}
function matchesLevel(messageLevel, configuredLevel) {
  return levels[messageLevel] >= levels[configuredLevel];
}
function nodeLogDestination(config2 = {}) {
  const { level = "info" } = config2;
  return {
    write(event) {
      let dest = process.stderr;
      if (levels[event.level] < levels["error"]) {
        dest = process.stdout;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      let trailingLine = event.newLine ? "\n" : "";
      if (event.label === "SKIP_FORMAT") {
        dest.write(event.message + trailingLine);
      } else {
        dest.write(getEventPrefix(event) + " " + event.message + trailingLine);
      }
    }
  };
}
function node_default(options) {
  return nodeLogDestination(options);
}
function consoleLogDestination(config2 = {}) {
  const { level = "info" } = config2;
  return {
    write(event) {
      let dest = console.error;
      if (levels[event.level] < levels["error"]) {
        dest = console.info;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      if (event.label === "SKIP_FORMAT") {
        dest(event.message);
      } else {
        dest(getEventPrefix(event) + " " + event.message);
      }
    }
  };
}
function createConsoleLogger({ level }) {
  return new AstroLogger({
    level,
    destination: consoleLogDestination()
  });
}
function console_default(options) {
  return consoleLogDestination(options);
}
const SGR_REGEX = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
function jsonLoggerDestination(config2 = {}) {
  const { pretty = false, level = "info" } = config2;
  return {
    write(event) {
      let dest = process.stderr;
      if (levels[event.level] < levels["error"]) {
        dest = process.stdout;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      let trailingLine = event.newLine ? "\n" : "";
      const message = event.message.replace(SGR_REGEX, "");
      if (pretty) {
        dest.write(
          JSON.stringify({ message, label: event.label, level: event.level }, null, 2) + trailingLine
        );
      } else {
        dest.write(
          JSON.stringify({ message, label: event.label, level: event.level }) + trailingLine
        );
      }
    }
  };
}
function compose(destinations) {
  return {
    write(chunk) {
      for (const logger of destinations) {
        logger.write(chunk);
      }
    },
    flush() {
      for (const logger of destinations) {
        if (logger.flush) {
          logger.flush();
        }
      }
    },
    close() {
      for (const logger of destinations) {
        if (logger.close) {
          logger.close();
        }
      }
    }
  };
}
async function loadLogger(config2, level = "info") {
  let cause = void 0;
  try {
    switch (config2.entrypoint) {
      case "astro/logger/node": {
        return new AstroLogger({
          destination: node_default(config2.config),
          level
        });
      }
      case "astro/logger/console": {
        return new AstroLogger({
          destination: console_default(config2.config),
          level
        });
      }
      case "astro/logger/json": {
        return new AstroLogger({
          destination: jsonLoggerDestination(config2.config),
          level
        });
      }
      case "astro/logger/compose": {
        let destinations = [];
        if (config2.config?.loggers) {
          const loggers = config2.config?.loggers;
          destinations = await Promise.all(
            loggers.map(async (loggerConfig) => {
              const logger = await import(
                /* @vite-ignore */
                loggerConfig.entrypoint
              );
              return logger.default(loggerConfig.config);
            })
          );
        }
        return new AstroLogger({
          destination: compose(destinations),
          level
        });
      }
      default: {
        const nodeLogger = await import(
          /* @vite-ignore */
          config2.entrypoint
        );
        return new AstroLogger({
          destination: nodeLogger.default(config2.config),
          level
        });
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      cause = e;
    }
  }
  const error2 = new AstroError({
    ...UnableToLoadLogger,
    message: UnableToLoadLogger.message(config2.entrypoint)
  });
  if (cause) {
    error2.cause = cause;
  }
  throw error2;
}
const PipelineFeatures = {
  redirects: 1 << 0,
  sessions: 1 << 1,
  actions: 1 << 2,
  middleware: 1 << 3,
  i18n: 1 << 4,
  cache: 1 << 5
};
const ALL_PIPELINE_FEATURES = PipelineFeatures.redirects | PipelineFeatures.sessions | PipelineFeatures.actions | PipelineFeatures.middleware | PipelineFeatures.i18n | PipelineFeatures.cache;
class Pipeline {
  internalMiddleware;
  resolvedMiddleware = void 0;
  resolvedLogger = false;
  resolvedActions = void 0;
  resolvedSessionDriver = void 0;
  resolvedCacheProvider = void 0;
  compiledCacheRoutes = void 0;
  nodePool;
  htmlStringCache;
  /**
   * Bit mask of pipeline features activated by handler classes.
   * Each handler sets its bit via `|=`. Only meaningful when a
   * custom `src/app.ts` fetch handler is in use.
   */
  usedFeatures = 0;
  logger;
  manifest;
  /**
   * "development" or "production" only
   */
  runtimeMode;
  renderers;
  resolve;
  streaming;
  /**
   * Used to provide better error messages for `Astro.clientAddress`
   */
  adapterName;
  clientDirectives;
  inlinedScripts;
  compressHTML;
  i18n;
  middleware;
  routeCache;
  /**
   * Used for `Astro.site`.
   */
  site;
  /**
   * Array of built-in, internal, routes.
   * Used to find the route module
   */
  defaultRoutes;
  actions;
  sessionDriver;
  cacheProvider;
  cacheConfig;
  serverIslands;
  /** Route data derived from the manifest, used for route matching. */
  manifestData;
  /** Pattern-matching router built from manifestData. */
  #router;
  constructor(logger, manifest2, runtimeMode, renderers2, resolve, streaming, adapterName = manifest2.adapterName, clientDirectives = manifest2.clientDirectives, inlinedScripts = manifest2.inlinedScripts, compressHTML = manifest2.compressHTML, i18n = manifest2.i18n, middleware = manifest2.middleware, routeCache = new RouteCache(logger, runtimeMode), site = manifest2.site ? new URL(manifest2.site) : void 0, defaultRoutes = createDefaultRoutes(manifest2), actions = manifest2.actions, sessionDriver = manifest2.sessionDriver, cacheProvider = manifest2.cacheProvider, cacheConfig = manifest2.cacheConfig, serverIslands = manifest2.serverIslandMappings) {
    this.logger = logger;
    this.manifest = manifest2;
    this.runtimeMode = runtimeMode;
    this.renderers = renderers2;
    this.resolve = resolve;
    this.streaming = streaming;
    this.adapterName = adapterName;
    this.clientDirectives = clientDirectives;
    this.inlinedScripts = inlinedScripts;
    this.compressHTML = compressHTML;
    this.i18n = i18n;
    this.middleware = middleware;
    this.routeCache = routeCache;
    this.site = site;
    this.defaultRoutes = defaultRoutes;
    this.actions = actions;
    this.sessionDriver = sessionDriver;
    this.cacheProvider = cacheProvider;
    this.cacheConfig = cacheConfig;
    this.serverIslands = serverIslands;
    this.manifestData = { routes: (manifest2.routes ?? []).map((route) => route.routeData) };
    ensure404Route(this.manifestData);
    this.#router = new Router(this.manifestData.routes, {
      base: manifest2.base,
      trailingSlash: manifest2.trailingSlash,
      buildFormat: manifest2.buildFormat
    });
    this.internalMiddleware = [];
    if (manifest2.experimentalQueuedRendering.enabled) {
      this.nodePool = this.createNodePool(
        manifest2.experimentalQueuedRendering.poolSize ?? 1e3,
        false
      );
      if (manifest2.experimentalQueuedRendering.contentCache) {
        this.htmlStringCache = this.createStringCache();
      }
    }
  }
  /**
   * Low-level route matching against the manifest routes. Returns the
   * matched `RouteData` or `undefined`. Does not filter prerendered
   * routes or check public assets — use `BaseApp.match()` for that.
   */
  matchRoute(pathname) {
    const match = this.#router.match(pathname, { allowWithoutBase: true });
    if (match.type !== "match") return void 0;
    return match.route;
  }
  /**
   * Returns all routes matching the given pathname, in priority order.
   * Used when the first match cannot serve the request (e.g. a
   * prerendered dynamic route that doesn't cover this specific path)
   * and the caller needs to try subsequent matches.
   */
  matchAllRoutes(pathname) {
    return this.#router.matchAll(pathname, { allowWithoutBase: true });
  }
  /**
   * Rebuilds the internal router after routes have been added or
   * removed (e.g. by the dev server on HMR).
   */
  rebuildRouter() {
    this.#router = new Router(this.manifestData.routes, {
      base: this.manifest.base,
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat
    });
  }
  /**
   * Resolves the middleware from the manifest, and returns the `onRequest` function. If `onRequest` isn't there,
   * it returns a no-op function
   */
  async getMiddleware() {
    if (this.resolvedMiddleware) {
      return this.resolvedMiddleware;
    }
    if (this.middleware) {
      const middlewareInstance = await this.middleware();
      const onRequest = middlewareInstance.onRequest ?? NOOP_MIDDLEWARE_FN;
      const internalMiddlewares = [onRequest];
      if (this.manifest.checkOrigin) {
        internalMiddlewares.unshift(createOriginCheckMiddleware());
      }
      this.resolvedMiddleware = sequence(...internalMiddlewares);
      return this.resolvedMiddleware;
    } else {
      this.resolvedMiddleware = NOOP_MIDDLEWARE_FN;
      return this.resolvedMiddleware;
    }
  }
  /**
   * Clears the cached middleware so it is re-resolved on the next request.
   * Called via HMR when middleware files change during development.
   */
  clearMiddleware() {
    this.resolvedMiddleware = void 0;
  }
  /**
   * Resolves the logger destination from the manifest and updates the pipeline logger.
   * If the user configured `experimental.logger`, the bundled logger factory is loaded
   * and replaces the default console destination. This is lazy and only resolves once.
   */
  async getLogger() {
    if (this.resolvedLogger) {
      return this.logger;
    }
    this.resolvedLogger = true;
    if (this.manifest.experimentalLogger) {
      this.logger = await loadLogger(this.manifest.experimentalLogger);
    }
    return this.logger;
  }
  async getActions() {
    if (this.resolvedActions) {
      return this.resolvedActions;
    } else if (this.actions) {
      this.resolvedActions = await this.actions();
      return this.resolvedActions;
    }
    return NOOP_ACTIONS_MOD;
  }
  async getSessionDriver() {
    if (this.resolvedSessionDriver !== void 0) {
      return this.resolvedSessionDriver;
    }
    if (this.sessionDriver) {
      const driverModule = await this.sessionDriver();
      this.resolvedSessionDriver = driverModule?.default || null;
      return this.resolvedSessionDriver;
    }
    this.resolvedSessionDriver = null;
    return null;
  }
  async getCacheProvider() {
    if (this.resolvedCacheProvider !== void 0) {
      return this.resolvedCacheProvider;
    }
    if (this.cacheProvider) {
      const mod = await this.cacheProvider();
      const factory = mod?.default || null;
      this.resolvedCacheProvider = factory ? factory(this.cacheConfig?.options) : null;
      return this.resolvedCacheProvider;
    }
    this.resolvedCacheProvider = null;
    return null;
  }
  async getServerIslands() {
    if (this.serverIslands) {
      return this.serverIslands();
    }
    return {
      serverIslandMap: /* @__PURE__ */ new Map(),
      serverIslandNameMap: /* @__PURE__ */ new Map()
    };
  }
  async getAction(path) {
    const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
    let { server } = await this.getActions();
    if (!server || !(typeof server === "object")) {
      throw new TypeError(
        `Expected \`server\` export in actions file to be an object. Received ${typeof server}.`
      );
    }
    for (const key of pathKeys) {
      if (FORBIDDEN_PATH_KEYS.has(key)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      if (!Object.hasOwn(server, key)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      server = server[key];
    }
    if (typeof server !== "function") {
      throw new TypeError(
        `Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server}.`
      );
    }
    return server;
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance)
        };
      }
    }
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (this.manifest.pageMap) {
        const importComponentInstance = this.manifest.pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        return await importComponentInstance();
      } else if (this.manifest.pageModule) {
        return this.manifest.pageModule;
      }
      throw new Error(
        "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
      );
    }
  }
  createNodePool(poolSize, stats) {
    return new NodePool(poolSize, stats);
  }
  createStringCache() {
    return new HTMLStringCache(1e3);
  }
}
function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter(
    (e) => isRenderInstruction(e) === false || isRenderTemplateResult(e)
  );
  if (expressions?.length !== 1) return;
  const expression = expressions[0];
  if (isRenderTemplateResult(expression)) {
    return getFunctionExpression(expression);
  }
  return expression;
}
class Slots {
  #result;
  #slots;
  #logger;
  constructor(result, slots, logger) {
    this.#result = result;
    this.#slots = slots;
    this.#logger = logger;
    if (slots) {
      for (const key of Object.keys(slots)) {
        if (this[key] !== void 0) {
          throw new AstroError({
            ...ReservedSlotName,
            message: ReservedSlotName.message(key)
          });
        }
        Object.defineProperty(this, key, {
          get() {
            return true;
          },
          enumerable: true
        });
      }
    }
  }
  has(name) {
    if (!this.#slots) return false;
    return Boolean(this.#slots[name]);
  }
  async render(name, args = []) {
    if (!this.#slots || !this.has(name)) return;
    const result = this.#result;
    if (!Array.isArray(args)) {
      this.#logger.warn(
        null,
        `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
      );
    } else if (args.length > 0) {
      const slotValue = this.#slots[name];
      const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
      const expression = getFunctionExpression(component);
      if (expression) {
        const slot = async () => typeof expression === "function" ? expression(...args) : expression;
        return await renderSlotToString(result, slot).then((res) => {
          return res;
        });
      }
      if (typeof component === "function") {
        return await renderJSX(result, component(...args)).then(
          (res) => res != null ? String(res) : res
        );
      }
    }
    const content = await renderSlotToString(result, this.#slots[name]);
    const outHTML = chunkToString(result, content);
    return outHTML;
  }
}
const hrtime$1 = /* @__PURE__ */ Object.assign(function hrtime(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, { bigint: function bigint() {
  return BigInt(Date.now() * 1e6);
} });
class ReadStream {
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
}
class WriteStream {
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
}
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = () => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  };
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
const NODE_VERSION = "22.14.0";
class Process extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: () => 0 });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
}
const globalProcess = globalThis["process"];
const getBuiltinModule = globalProcess.getBuiltinModule;
const workerdProcess = getBuiltinModule("node:process");
const unenvProcess = new Process({
  env: globalProcess.env,
  hrtime: hrtime$1,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
const { exit, features, platform } = workerdProcess;
const {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime2,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
const _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime2,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
globalThis.process = _process;
const noop = Object.assign(() => {
}, { __unenv__: true });
const _console = globalThis.console;
const _ignoreErrors = true;
const _stderr = new Writable();
const _stdout = new Writable();
const Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
const _times = /* @__PURE__ */ new Map();
const _stdoutErrorHandler = noop;
const _stderrErrorHandler = noop;
const workerdConsole = globalThis["console"];
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
globalThis.console = workerdConsole;
const _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
const _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
const nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
class PerformanceEntry {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
}
const PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
class PerformanceMeasure extends PerformanceEntry {
  entryType = "measure";
}
class PerformanceResourceTiming extends PerformanceEntry {
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
}
class PerformanceObserverEntryList {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
}
class Performance {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
}
class PerformanceObserver {
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
}
const performance$1 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
if (!("__unenv__" in performance$1)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance$1)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance$1, key, desc);
      }
    }
  }
}
globalThis.performance = performance$1;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
const sessionKVBindingName = "SESSION";
const UNDEFINED = -1;
const HOLE = -2;
const NAN = -3;
const POSITIVE_INFINITY = -4;
const NEGATIVE_INFINITY = -5;
const NEGATIVE_ZERO = -6;
const SPARSE = -7;
const MAX_ARRAY_LEN = 2 ** 32 - 1;
const MAX_ARRAY_INDEX = MAX_ARRAY_LEN - 1;
class DevalueError extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   * @param {any} [value] - The value that failed to be serialized
   * @param {any} [root] - The root value being serialized
   */
  constructor(message, keys, value, root) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
    this.value = value;
    this.root = root;
  }
}
function is_primitive(thing) {
  return thing === null || typeof thing !== "object" && typeof thing !== "function";
}
const object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const char = str[i];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i) + replacement;
      last_pos = i + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
const is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function stringify_key(key) {
  return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
function is_valid_array_index(n) {
  if (!Number.isInteger(n)) return false;
  if (n < 0) return false;
  if (n > MAX_ARRAY_INDEX) return false;
  return true;
}
function is_valid_array_len(n) {
  if (!Number.isInteger(n)) return false;
  if (n < 0) return false;
  if (n > MAX_ARRAY_LEN) return false;
  return true;
}
function is_valid_array_index_string(s2) {
  if (s2.length === 0) return false;
  if (s2.length > 1 && s2.charCodeAt(0) === 48) return false;
  for (let i = 0; i < s2.length; i++) {
    const c = s2.charCodeAt(i);
    if (c < 48 || c > 57) return false;
  }
  return is_valid_array_index(+s2);
}
function valid_array_indices(array) {
  const keys = Object.keys(array);
  for (var i = keys.length - 1; i >= 0; i--) {
    if (is_valid_array_index_string(keys[i])) {
      break;
    }
  }
  keys.length = i + 1;
  return keys;
}
function encode_native(array_buffer) {
  return new Uint8Array(array_buffer).toBase64();
}
function decode_native(base64) {
  return Uint8Array.fromBase64(base64).buffer;
}
function encode_buffer(array_buffer) {
  return Buffer.from(array_buffer).toString("base64");
}
function decode_buffer(base64) {
  return Uint8Array.from(Buffer.from(base64, "base64")).buffer;
}
function encode_legacy(array_buffer) {
  const array = new Uint8Array(array_buffer);
  let binary2 = "";
  const chunk_size = 32768;
  for (let i = 0; i < array.length; i += chunk_size) {
    const chunk = array.subarray(i, i + chunk_size);
    binary2 += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary2);
}
function decode_legacy(base64) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    array[i] = binary_string.charCodeAt(i);
  }
  return array.buffer;
}
const native = typeof Uint8Array.fromBase64 === "function";
const buffer = typeof process === "object" && process.versions?.node !== void 0;
const encode64 = native ? encode_native : buffer ? encode_buffer : encode_legacy;
const decode64 = native ? decode_native : buffer ? decode_buffer : decode_legacy;
function parse(serialized, revivers) {
  return unflatten$1(JSON.parse(serialized), revivers);
}
function unflatten$1(parsed, revivers) {
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  let hydrating = null;
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED) return void 0;
    if (index === NAN) return NaN;
    if (index === POSITIVE_INFINITY) return Infinity;
    if (index === NEGATIVE_INFINITY) return -Infinity;
    if (index === NEGATIVE_ZERO) return -0;
    if (standalone || typeof index !== "number") {
      throw new Error(`Invalid input`);
    }
    if (index in hydrated) return hydrated[index];
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
        if (reviver) {
          let i = value[1];
          if (typeof i !== "number") {
            i = values.push(value[1]) - 1;
          }
          hydrating ??= /* @__PURE__ */ new Set();
          if (hydrating.has(i)) {
            throw new Error("Invalid circular reference");
          }
          hydrating.add(i);
          hydrated[index] = reviver(hydrate(i));
          hydrating.delete(i);
          return hydrated[index];
        }
        switch (type) {
          case "Date":
            hydrated[index] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index] = set;
            for (let i = 1; i < value.length; i += 1) {
              set.add(hydrate(value[i]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index] = map;
            for (let i = 1; i < value.length; i += 2) {
              map.set(hydrate(value[i]), hydrate(value[i + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = new RegExp(value[1], value[2]);
            break;
          case "Object": {
            const wrapped_index = value[1];
            if (typeof values[wrapped_index] === "object" && values[wrapped_index][0] !== "BigInt") {
              throw new Error("Invalid input");
            }
            hydrated[index] = Object(hydrate(wrapped_index));
            break;
          }
          case "BigInt":
            hydrated[index] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index] = obj;
            for (let i = 1; i < value.length; i += 2) {
              if (value[i] === "__proto__") {
                throw new Error("Cannot parse an object with a `__proto__` property");
              }
              obj[value[i]] = hydrate(value[i + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Float16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array":
          case "DataView": {
            if (values[value[1]][0] !== "ArrayBuffer") {
              throw new Error("Invalid data");
            }
            const TypedArrayConstructor = globalThis[type];
            const buffer2 = hydrate(value[1]);
            hydrated[index] = value[2] !== void 0 ? new TypedArrayConstructor(buffer2, value[2], value[3]) : new TypedArrayConstructor(buffer2);
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            if (typeof base64 !== "string") {
              throw new Error("Invalid ArrayBuffer encoding");
            }
            const arraybuffer = decode64(base64);
            hydrated[index] = arraybuffer;
            break;
          }
          case "Temporal.Duration":
          case "Temporal.Instant":
          case "Temporal.PlainDate":
          case "Temporal.PlainTime":
          case "Temporal.PlainDateTime":
          case "Temporal.PlainMonthDay":
          case "Temporal.PlainYearMonth":
          case "Temporal.ZonedDateTime": {
            const temporalName = type.slice(9);
            hydrated[index] = Temporal[temporalName].from(value[1]);
            break;
          }
          case "URL": {
            const url = new URL(value[1]);
            hydrated[index] = url;
            break;
          }
          case "URLSearchParams": {
            const url = new URLSearchParams(value[1]);
            hydrated[index] = url;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else if (value[0] === SPARSE) {
        const len = value[1];
        if (!is_valid_array_len(len)) {
          throw new Error("Invalid input");
        }
        const array = [];
        hydrated[index] = array;
        array[MAX_ARRAY_INDEX] = void 0;
        delete array[MAX_ARRAY_INDEX];
        for (let i = 2; i < value.length; i += 2) {
          const idx = value[i];
          if (!is_valid_array_index(idx) || idx >= len) {
            throw new Error("Invalid input");
          }
          array[idx] = hydrate(value[i + 1]);
        }
        array.length = len;
      } else {
        const array = new Array(value.length);
        hydrated[index] = array;
        for (let i = 0; i < value.length; i += 1) {
          const n = value[i];
          if (n === HOLE) continue;
          array[i] = hydrate(n);
        }
      }
    } else {
      const object = {};
      hydrated[index] = object;
      for (const key of Object.keys(value)) {
        if (key === "__proto__") {
          throw new Error("Cannot parse an object with a `__proto__` property");
        }
        const n = value[key];
        object[key] = hydrate(n);
      }
    }
    return hydrated[index];
  }
  return hydrate(0);
}
function stringify$2(value, reducers) {
  const stringified = run(false, value, reducers);
  return typeof stringified === "string" ? stringified : `[${stringified.join(",")}]`;
}
function run(async, value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  if (reducers) {
    for (const key of Object.getOwnPropertyNames(reducers)) {
      custom.push({ key, fn: reducers[key] });
    }
  }
  const keys = [];
  let p = 0;
  function flatten(thing, index2) {
    if (thing === void 0) return UNDEFINED;
    if (Number.isNaN(thing)) return NAN;
    if (thing === Infinity) return POSITIVE_INFINITY;
    if (thing === -Infinity) return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;
    if (indexes.has(thing)) return (
      /** @type {number} */
      indexes.get(thing)
    );
    index2 ??= p++;
    indexes.set(thing, index2);
    for (const { key, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index2] = `["${key}",${flatten(value2)}]`;
        return index2;
      }
    }
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
    } else if (typeof thing === "symbol") {
      throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive(thing);
    } else if (typeof thing.then === "function") {
      {
        throw new DevalueError(
          `Cannot stringify a Promise or thenable — use stringifyAsync instead`,
          keys,
          thing,
          value
        );
      }
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "BigInt":
          str = `["Object",${flatten(thing.valueOf())}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "URL":
          str = `["URL",${stringify_string(thing.toString())}]`;
          break;
        case "URLSearchParams":
          str = `["URLSearchParams",${stringify_string(thing.toString())}]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array": {
          let mostly_dense = false;
          str = "[";
          for (let i = 0; i < thing.length; i += 1) {
            if (i > 0) str += ",";
            if (Object.hasOwn(thing, i)) {
              keys.push(`[${i}]`);
              str += flatten(thing[i]);
              keys.pop();
            } else if (mostly_dense) {
              str += HOLE;
            } else {
              const populated_keys = valid_array_indices(
                /** @type {any[]} */
                thing
              );
              const population = populated_keys.length;
              const d = String(thing.length).length;
              const hole_cost = (thing.length - population) * 3;
              const sparse_cost = 4 + d + population * (d + 1);
              if (hole_cost > sparse_cost) {
                str = "[" + SPARSE + "," + thing.length;
                for (let j = 0; j < populated_keys.length; j++) {
                  const key = populated_keys[j];
                  keys.push(`[${key}]`);
                  str += "," + key + "," + flatten(thing[key]);
                  keys.pop();
                }
                break;
              } else {
                mostly_dense = true;
                str += HOLE;
              }
            }
          }
          str += "]";
          break;
        }
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key, value2] of thing) {
            keys.push(`.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`);
            str += `,${flatten(key)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
        case "DataView": {
          const typedArray = thing;
          str = '["' + type + '",' + flatten(typedArray.buffer);
          if (typedArray.byteLength !== typedArray.buffer.byteLength) {
            str += `,${typedArray.byteOffset},${typedArray.length}`;
          }
          str += "]";
          break;
        }
        case "ArrayBuffer": {
          const arraybuffer = thing;
          const base64 = encode64(arraybuffer);
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          str = `["${type}",${stringify_string(thing.toString())}]`;
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key of Object.keys(thing)) {
              if (key === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              keys.push(stringify_key(key));
              str += `,${stringify_string(key)},${flatten(thing[key])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key of Object.keys(thing)) {
              if (key === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              if (started) str += ",";
              started = true;
              keys.push(stringify_key(key));
              str += `${stringify_string(key)}:${flatten(thing[key])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index2] = str;
    return index2;
  }
  const index = flatten(value);
  if (index < 0) return `${index}`;
  return stringified;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}
const ACTION_QUERY_PARAMS = {
  actionName: "_action"
};
const ACTION_RPC_ROUTE_PATTERN = "/_actions/[...path]";
const __vite_import_meta_env__$1 = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://dentalempireos.com", "SSR": true };
const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
const statusToCodeMap = Object.fromEntries(
  Object.entries(codeToStatusMap).map(([key, value]) => [value, key])
);
class ActionError extends Error {
  type = "AstroActionError";
  code = "INTERNAL_SERVER_ERROR";
  status = 500;
  constructor(params) {
    super(params.message);
    this.code = params.code;
    this.status = ActionError.codeToStatus(params.code);
    if (params.stack) {
      this.stack = params.stack;
    }
  }
  static codeToStatus(code) {
    return codeToStatusMap[code];
  }
  static statusToCode(status) {
    return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
  }
  static fromJson(body) {
    if (isInputError(body)) {
      return new ActionInputError(body.issues);
    }
    if (isActionError(body)) {
      return new ActionError(body);
    }
    return new ActionError({
      code: "INTERNAL_SERVER_ERROR"
    });
  }
}
function isActionError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionError";
}
function isInputError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionInputError" && "issues" in error2 && Array.isArray(error2.issues);
}
class ActionInputError extends ActionError {
  type = "AstroActionInputError";
  // We don't expose all ZodError properties.
  // Not all properties will serialize from server to client,
  // and we don't want to import the full ZodError object into the client.
  issues;
  fields;
  constructor(issues) {
    super({
      message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
      code: "BAD_REQUEST"
    });
    this.issues = issues;
    this.fields = {};
    for (const issue of issues) {
      if (issue.path.length > 0) {
        const key = issue.path[0].toString();
        this.fields[key] ??= [];
        this.fields[key]?.push(issue.message);
      }
    }
  }
}
function deserializeActionResult(res) {
  if (res.type === "error") {
    let json;
    try {
      json = JSON.parse(res.body);
    } catch {
      return {
        data: void 0,
        error: new ActionError({
          message: res.body,
          code: "INTERNAL_SERVER_ERROR"
        })
      };
    }
    if (Object.assign(__vite_import_meta_env__$1, { OS: "Windows_NT", _: "C:/Program Files/nodejs/node.exe" })?.PROD) {
      return { error: ActionError.fromJson(json), data: void 0 };
    } else {
      const error2 = ActionError.fromJson(json);
      error2.stack = actionResultErrorStack.get();
      return {
        error: error2,
        data: void 0
      };
    }
  }
  if (res.type === "empty") {
    return { data: void 0, error: void 0 };
  }
  return {
    data: parse(res.body, {
      URL: (href) => new URL(href)
    }),
    error: void 0
  };
}
const actionResultErrorStack = /* @__PURE__ */ (function actionResultErrorStackFn() {
  let errorStack;
  return {
    set(stack) {
      errorStack = stack;
    },
    get() {
      return errorStack;
    }
  };
})();
function getActionQueryString(name) {
  const searchParams = new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name });
  return `?${searchParams.toString()}`;
}
var ImportType;
!(function(A) {
  A[A.Static = 1] = "Static", A[A.Dynamic = 2] = "Dynamic", A[A.ImportMeta = 3] = "ImportMeta", A[A.StaticSourcePhase = 4] = "StaticSourcePhase", A[A.DynamicSourcePhase = 5] = "DynamicSourcePhase", A[A.StaticDeferPhase = 6] = "StaticDeferPhase", A[A.DynamicDeferPhase = 7] = "DynamicDeferPhase";
})(ImportType || (ImportType = {}));
1 === new Uint8Array(new Uint16Array([1]).buffer)[0];
const E = () => {
  return A = "AGFzbQEAAAABKwhgAX8Bf2AEf39/fwBgAAF/YAAAYAF/AGADf39/AX9gAn9/AX9gA39/fwADODcAAQECAgICAgICAgICAgICAgICAgICAgICAwIAAwMDBAAEAAAABQAAAAAAAwMDAAAGAAcABgIFBAUBcAEBAQUDAQABBg8CfwFBsPIAC38AQbDyAAsHnQEbBm1lbW9yeQIAAnNhAAABZQADAmlzAAQCaWUABQJzcwAGAnNlAAcCaXQACAJhaQAJAmlkAAoCaXAACwJlcwAMAmVlAA0DZWxzAA4DZWxlAA8CcmkAEAJyZQARAWYAEgJtcwATAnJhABQDYWtzABUDYWtlABYDYXZzABcDYXZlABgDcnNhABkFcGFyc2UAGgtfX2hlYXBfYmFzZQMBCrxJN2gBAX9BACAANgL0CUEAKALQCSIBIABBAXRqIgBBADsBAEEAIABBAmoiADYC+AlBACAANgL8CUEAQQA2AtQJQQBBADYC5AlBAEEANgLcCUEAQQA2AtgJQQBBADYC7AlBAEEANgLgCSABC9MBAQN/QQAoAuQJIQRBAEEAKAL8CSIFNgLkCUEAIAQ2AugJQQAgBUEoajYC/AkgBEEkakHUCSAEGyAFNgIAQQAoAsgJIQRBACgCxAkhBiAFIAE2AgAgBSAANgIIIAUgAiACQQJqQQAgBiADRiIAGyAEIANGIgQbNgIMIAUgAzYCFCAFQQA2AhAgBSACNgIEIAVCADcCICAFQQNBAUECIAAbIAQbNgIcIAVBACgCxAkgA0YiAjoAGAJAAkAgAg0AQQAoAsgJIANHDQELQQBBAToAgAoLC14BAX9BACgC7AkiBEEQakHYCSAEG0EAKAL8CSIENgIAQQAgBDYC7AlBACAEQRRqNgL8CUEAQQE6AIAKIARBADYCECAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgALCABBACgChAoLFQBBACgC3AkoAgBBACgC0AlrQQF1Cx4BAX9BACgC3AkoAgQiAEEAKALQCWtBAXVBfyAAGwsVAEEAKALcCSgCCEEAKALQCWtBAXULHgEBf0EAKALcCSgCDCIAQQAoAtAJa0EBdUF/IAAbCwsAQQAoAtwJKAIcCx4BAX9BACgC3AkoAhAiAEEAKALQCWtBAXVBfyAAGws7AQF/AkBBACgC3AkoAhQiAEEAKALECUcNAEF/DwsCQCAAQQAoAsgJRw0AQX4PCyAAQQAoAtAJa0EBdQsLAEEAKALcCS0AGAsVAEEAKALgCSgCAEEAKALQCWtBAXULFQBBACgC4AkoAgRBACgC0AlrQQF1Cx4BAX9BACgC4AkoAggiAEEAKALQCWtBAXVBfyAAGwseAQF/QQAoAuAJKAIMIgBBACgC0AlrQQF1QX8gABsLJQEBf0EAQQAoAtwJIgBBJGpB1AkgABsoAgAiADYC3AkgAEEARwslAQF/QQBBACgC4AkiAEEQakHYCSAAGygCACIANgLgCSAAQQBHCwgAQQAtAIgKCwgAQQAtAIAKCysBAX9BAEEAKAKMCiIAQRBqQQAoAtwJQSBqIAAbKAIAIgA2AowKIABBAEcLFQBBACgCjAooAgBBACgC0AlrQQF1CxUAQQAoAowKKAIEQQAoAtAJa0EBdQsVAEEAKAKMCigCCEEAKALQCWtBAXULFQBBACgCjAooAgxBACgC0AlrQQF1CwoAQQBBADYCjAoLuw8BBX8jAEGA0ABrIgAkAEEAQQE6AIgKQQBBACgCzAk2ApQKQQBBACgC0AlBfmoiATYCqApBACABQQAoAvQJQQF0aiICNgKsCkEAQQA6AIAKQQBBADsBkApBAEEAOwGSCkEAQQA6AJgKQQBBADYChApBAEEAOgDwCUEAIABBgBBqNgKcCkEAIAA2AqAKQQBBADoApAoCQAJAAkACQANAQQAgAUECaiIDNgKoCiABIAJPDQECQCADLwEAIgJBd2pBBUkNAAJAAkACQAJAAkAgAkGbf2oOBQEICAgCAAsgAkEgRg0EIAJBL0YNAyACQTtGDQIMBwtBAC8BkgoNASADEBtFDQEgAUEEakGCCEEKEDYNARAcQQAtAIgKDQFBAEEAKAKoCiIBNgKUCgwHCyADEBtFDQAgAUEEakGMCEEKEDYNABAdC0EAQQAoAqgKNgKUCgwBCwJAIAEvAQQiA0EqRg0AIANBL0cNBBAeDAELQQEQHwtBACgCrAohAkEAKAKoCiEBDAALC0EAIQIgAyEBQQAtAPAJDQIMAQtBACABNgKoCkEAQQA6AIgKCwNAQQAgAUECaiIDNgKoCgJAAkACQAJAAkACQAJAIAFBACgCrApPDQACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCADLwEAIgJBYGoOEBMSCRISEhIIAQUSEgQSEgoACwJAAkACQAJAIAJBpX9qDg8FFQYVFQ4VFQMVARUVFQIACyACQXdqQQVJDRUgAkGFf2oOAwgUCRQLQQAvAZIKDRMgAxAbRQ0TIAFBBGpBgghBChA2DRMQHAwTCyADEBtFDRIgAUEEakGMCEEKEDYNEhAdDBILIAMQG0UNESABKQAEQuyAhIOwjsA5Ug0RIAEvAQwiA0F3aiIBQRdLDQ9BASABdEGfgIAEcUUNDwwQC0EAQQAvAZIKIgFBAWo7AZIKQQAoApwKIAFBA3RqIgFBATYCACABQQAoApQKNgIEDBALQQBBAC8BkgoiAUEBajsBkgpBACgCnAogAUEDdGoiAUEINgIAIAFBACgClAo2AgQMDwtBAC8BkgoiAUUNC0EAIAFBf2o7AZIKDA4LQQAvAZAKIgNFDQ1BAC8BkgoiAkUNDSACQQN0QQAoApwKakF4aigCAEEFRw0NIANBAnRBACgCoApqQXxqKAIAIgMoAgQNDUEAIAFBBGo2AqgKIANBACgClApBAmo2AgRBARAgGiADQQAoAqgKIgE2AhBBACABQX5qNgKoCgwNC0EALwGSCiIDRQ0JQQAgA0F/aiIDOwGSCkEALwGQCiICRQ0MQQAoApwKIANB//8DcUEDdGooAgBBBUcNDAJAIAJBAnRBACgCoApqQXxqKAIAIgMoAgQNACADQQAoApQKQQJqNgIEC0EAIAJBf2o7AZAKIAMgAUEEajYCDAwMCwJAQQAoApQKIgEvAQBBKUcNAEEAKALkCSIDRQ0AIAMoAgQgAUcNAEEAQQAoAugJIgM2AuQJAkAgA0UNACADQQA2AiQMAQtBAEEANgLUCQtBAEEALwGSCiIDQQFqOwGSCkEAKAKcCiADQQN0aiIDQQZBAkEALQCkChs2AgAgAyABNgIEQQBBADoApAoMCwtBAC8BkgoiAUUNB0EAIAFBf2oiATsBkgpBACgCnAogAUH//wNxQQN0aigCAEEERg0EDAoLQScQIQwJC0EiECEMCAsCQAJAIAEvAQQiAUEqRg0AIAFBL0cNARAeDAoLQQEQHwwJCwJAAkACQAJAQQAoApQKIgEvAQAiAxAiRQ0AAkACQCADQVVqDgQACQEDCQsgAUF+ai8BAEErRg0DDAgLIAFBfmovAQBBLUYNAgwHCyADQSlHDQFBACgCnApBAC8BkgoiAkEDdGooAgQQI0UNAgwGCyABQX5qLwEAQVBqQf//A3FBCk8NBQtBAC8BkgohAgsCQAJAIAJB//8DcSICRQ0AIANB5gBHDQBBACgCnAogAkF/akEDdGoiBCgCAEEBRw0AIAFBfmovAQBB7wBHDQEgAUF8ahAkRQ0BIAQoAgRBlghBAxAlRQ0BDAULIANB/QBHDQBBACgCnAogAkEDdGoiAigCBBAmDQQgAigCAEEGRg0ECyABECcNAyADRQ0DIANBL0ZBAC0AmApBAEdxDQMCQEEAKALsCSICRQ0AIAEgAigCAEkNACABIAIoAgRNDQQLIAFBfmohAUEAKALQCSECAkADQCABQQJqIgQgAk0NAUEAIAE2ApQKIAEvAQAhAyABQX5qIgQhASADEChFDQALIARBAmohBAsCQCADQf//A3EQKUUNACAEQX5qIQECQANAIAFBAmoiAyACTQ0BQQAgATYClAogAS8BACEDIAFBfmoiBCEBIAMQKQ0ACyAEQQJqIQMLIAMQKg0EC0EAQQE6AJgKDAcLQQAoApwKQQAvAZIKIgFBA3QiA2pBACgClAo2AgRBACABQQFqOwGSCkEAKAKcCiADakEDNgIACxArDAULQQAtAPAJQQAvAZAKQQAvAZIKcnJFIQIMBwsQLEEAQQA6AJgKDAMLEC1BACECDAULIANBoAFHDQELQQBBAToApAoLQQBBACgCqAo2ApQKC0EAKAKoCiEBDAALCyAAQYDQAGokACACCxoAAkBBACgC0AkgAEcNAEEBDwsgAEF+ahAuC/4KAQZ/QQBBACgCqAoiAEEMaiIBNgKoCkEAKALsCSECQQEQICEDAkACQAJAAkACQAJAAkACQAJAQQAoAqgKIgQgAUcNACADEC9FDQELAkACQAJAAkACQAJAAkAgA0EqRg0AIANB+wBHDQFBACAEQQJqNgKoCkEBECAhA0EAKAKoCiEEA0ACQAJAIANB//8DcSIDQSJGDQAgA0EnRg0AIAMQMxpBACgCqAohAwwBCyADECFBAEEAKAKoCkECaiIDNgKoCgtBARAgGgJAIAQgAxA0IgNBLEcNAEEAQQAoAqgKQQJqNgKoCkEBECAhAwsgA0H9AEYNA0EAKAKoCiIFIARGDQ8gBSEEIAVBACgCrApNDQAMDwsLQQAgBEECajYCqApBARAgGkEAKAKoCiIDIAMQNBoMAgtBAEEAOgCICgJAAkACQAJAAkACQCADQZ9/ag4MAgsEAQsDCwsLCwsFAAsgA0H2AEYNBAwKC0EAIARBDmoiAzYCqAoCQAJAAkBBARAgQZ9/ag4GABICEhIBEgtBACgCqAoiBSkAAkLzgOSD4I3AMVINESAFLwEKEClFDRFBACAFQQpqNgKoCkEAECAaC0EAKAKoCiIFQQJqQbIIQQ4QNg0QIAUvARAiAkF3aiIBQRdLDQ1BASABdEGfgIAEcUUNDQwOC0EAKAKoCiIFKQACQuyAhIOwjsA5Ug0PIAUvAQoiAkF3aiIBQRdNDQYMCgtBACAEQQpqNgKoCkEAECAaQQAoAqgKIQQLQQAgBEEQajYCqAoCQEEBECAiBEEqRw0AQQBBACgCqApBAmo2AqgKQQEQICEEC0EAKAKoCiEDIAQQMxogA0EAKAKoCiIEIAMgBBACQQBBACgCqApBfmo2AqgKDwsCQCAEKQACQuyAhIOwjsA5Ug0AIAQvAQoQKEUNAEEAIARBCmo2AqgKQQEQICEEQQAoAqgKIQMgBBAzGiADQQAoAqgKIgQgAyAEEAJBAEEAKAKoCkF+ajYCqAoPC0EAIARBBGoiBDYCqAoLQQAgBEEGajYCqApBAEEAOgCICkEBECAhBEEAKAKoCiEDIAQQMyEEQQAoAqgKIQIgBEHf/wNxIgFB2wBHDQNBACACQQJqNgKoCkEBECAhBUEAKAKoCiEDQQAhBAwEC0EAQQE6AIAKQQBBACgCqApBAmo2AqgKC0EBECAhBEEAKAKoCiEDAkAgBEHmAEcNACADQQJqQawIQQYQNg0AQQAgA0EIajYCqAogAEEBECBBABAyIAJBEGpB2AkgAhshAwNAIAMoAgAiA0UNBSADQgA3AgggA0EQaiEDDAALC0EAIANBfmo2AqgKDAMLQQEgAXRBn4CABHFFDQMMBAtBASEECwNAAkACQCAEDgIAAQELIAVB//8DcRAzGkEBIQQMAQsCQAJAQQAoAqgKIgQgA0YNACADIAQgAyAEEAJBARAgIQQCQCABQdsARw0AIARBIHJB/QBGDQQLQQAoAqgKIQMCQCAEQSxHDQBBACADQQJqNgKoCkEBECAhBUEAKAKoCiEDIAVBIHJB+wBHDQILQQAgA0F+ajYCqAoLIAFB2wBHDQJBACACQX5qNgKoCg8LQQAhBAwACwsPCyACQaABRg0AIAJB+wBHDQQLQQAgBUEKajYCqApBARAgIgVB+wBGDQMMAgsCQCACQVhqDgMBAwEACyACQaABRw0CC0EAIAVBEGo2AqgKAkBBARAgIgVBKkcNAEEAQQAoAqgKQQJqNgKoCkEBECAhBQsgBUEoRg0BC0EAKAKoCiEBIAUQMxpBACgCqAoiBSABTQ0AIAQgAyABIAUQAkEAQQAoAqgKQX5qNgKoCg8LIAQgA0EAQQAQAkEAIARBDGo2AqgKDwsQLQuFDAEKf0EAQQAoAqgKIgBBDGoiATYCqApBARAgIQJBACgCqAohAwJAAkACQAJAAkACQAJAAkAgAkEuRw0AQQAgA0ECajYCqAoCQEEBECAiAkHkAEYNAAJAIAJB8wBGDQAgAkHtAEcNB0EAKAKoCiICQQJqQZwIQQYQNg0HAkBBACgClAoiAxAxDQAgAy8BAEEuRg0ICyAAIAAgAkEIakEAKALICRABDwtBACgCqAoiAkECakGiCEEKEDYNBgJAQQAoApQKIgMQMQ0AIAMvAQBBLkYNBwtBACEEQQAgAkEMajYCqApBASEFQQUhBkEBECAhAkEAIQdBASEIDAILQQAoAqgKIgIpAAJC5YCYg9CMgDlSDQUCQEEAKAKUCiIDEDENACADLwEAQS5GDQYLQQAhBEEAIAJBCmo2AqgKQQIhCEEHIQZBASEHQQEQICECQQEhBQwBCwJAAkACQAJAIAJB8wBHDQAgAyABTQ0AIANBAmpBoghBChA2DQACQCADLwEMIgRBd2oiB0EXSw0AQQEgB3RBn4CABHENAgsgBEGgAUYNAQtBACEHQQchBkEBIQQgAkHkAEYNAQwCC0EAIQRBACADQQxqIgI2AqgKQQEhBUEBECAhCQJAQQAoAqgKIgYgAkYNAEHmACECAkAgCUHmAEYNAEEFIQZBACEHQQEhCCAJIQIMBAtBACEHQQEhCCAGQQJqQawIQQYQNg0EIAYvAQgQKEUNBAtBACEHQQAgAzYCqApBByEGQQEhBEEAIQVBACEIIAkhAgwCCyADIABBCmpNDQBBACEIQeQAIQICQCADKQACQuWAmIPQjIA5Ug0AAkACQCADLwEKIgRBd2oiB0EXSw0AQQEgB3RBn4CABHENAQtBACEIIARBoAFHDQELQQAhBUEAIANBCmo2AqgKQSohAkEBIQdBAiEIQQEQICIJQSpGDQRBACADNgKoCkEBIQRBACEHQQAhCCAJIQIMAgsgAyEGQQAhBwwCC0EAIQVBACEICwJAIAJBKEcNAEEAKAKcCkEALwGSCiICQQN0aiIDQQAoAqgKNgIEQQAgAkEBajsBkgogA0EFNgIAQQAoApQKLwEAQS5GDQRBAEEAKAKoCiIDQQJqNgKoCkEBECAhAiAAQQAoAqgKQQAgAxABAkACQCAFDQBBACgC5AkhAQwBC0EAKALkCSIBIAY2AhwLQQBBAC8BkAoiA0EBajsBkApBACgCoAogA0ECdGogATYCAAJAIAJBIkYNACACQSdGDQBBAEEAKAKoCkF+ajYCqAoPCyACECFBAEEAKAKoCkECaiICNgKoCgJAAkACQEEBECBBV2oOBAECAgACC0EAQQAoAqgKQQJqNgKoCkEBECAaQQAoAuQJIgMgAjYCBCADQQE6ABggA0EAKAKoCiICNgIQQQAgAkF+ajYCqAoPC0EAKALkCSIDIAI2AgQgA0EBOgAYQQBBAC8BkgpBf2o7AZIKIANBACgCqApBAmo2AgxBAEEALwGQCkF/ajsBkAoPC0EAQQAoAqgKQX5qNgKoCg8LAkAgBEEBcyACQfsAR3INAEEAKAKoCiECQQAvAZIKDQUDQAJAAkACQCACQQAoAqwKTw0AQQEQICICQSJGDQEgAkEnRg0BIAJB/QBHDQJBAEEAKAKoCkECajYCqAoLQQEQICEDQQAoAqgKIQICQCADQeYARw0AIAJBAmpBrAhBBhA2DQcLQQAgAkEIajYCqAoCQEEBECAiAkEiRg0AIAJBJ0cNBwsgACACQQAQMg8LIAIQIQtBAEEAKAKoCkECaiICNgKoCgwACwsCQAJAIAJBWWoOBAMBAQMACyACQSJGDQILQQAoAqgKIQYLIAYgAUcNAEEAIABBCmo2AqgKDwsgAkEqRyAHcQ0DQQAvAZIKQf//A3ENA0EAKAKoCiECQQAoAqwKIQEDQCACIAFPDQECQAJAIAIvAQAiA0EnRg0AIANBIkcNAQsgACADIAgQMg8LQQAgAkECaiICNgKoCgwACwsQLQsPC0EAIAJBfmo2AqgKDwtBAEEAKAKoCkF+ajYCqAoLRwEDf0EAKAKoCkECaiEAQQAoAqwKIQECQANAIAAiAkF+aiABTw0BIAJBAmohACACLwEAQXZqDgQBAAABAAsLQQAgAjYCqAoLmAEBA39BAEEAKAKoCiIBQQJqNgKoCiABQQZqIQFBACgCrAohAgNAAkACQAJAIAFBfGogAk8NACABQX5qLwEAIQMCQAJAIAANACADQSpGDQEgA0F2ag4EAgQEAgQLIANBKkcNAwsgAS8BAEEvRw0CQQAgAUF+ajYCqAoMAQsgAUF+aiEBC0EAIAE2AqgKDwsgAUECaiEBDAALC5wBAQN/QQAoAqgKIQECQANAAkACQCABLwEAIgJBL0cNAAJAIAEvAQIiAUEqRg0AIAFBL0cNBBAeDAILIAAQHwwBCwJAAkAgAEUNACACQXdqIgFBF0sNAUEBIAF0QZ+AgARxRQ0BDAILIAIQKUUNAwwBCyACQaABRw0CC0EAQQAoAqgKIgNBAmoiATYCqAogA0EAKAKsCkkNAAsLIAILiAEBBH9BACgCqAohAUEAKAKsCiECAkACQANAIAEiA0ECaiEBIAMgAk8NASABLwEAIgQgAEYNAgJAIARB3ABGDQAgBEF2ag4EAgEBAgELIANBBGohASADLwEEQQ1HDQAgA0EGaiABIAMvAQZBCkYbIQEMAAsLQQAgATYCqAoQLQ8LQQAgATYCqAoLbAEBfwJAAkAgAEFfaiIBQQVLDQBBASABdEExcQ0BCyAAQUZqQf//A3FBBkkNACAAQSlHIABBWGpB//8DcUEHSXENAAJAIABBpX9qDgQBAAABAAsgAEH9AEcgAEGFf2pB//8DcUEESXEPC0EBCy4BAX9BASEBAkAgAEGcCUEFECUNACAAQZYIQQMQJQ0AIABBpglBAhAlIQELIAELygEBAn8CQAJAIAAvAQAiAUF3akEFSQ0AIAFBIEYNACABQSlGDQAgAUHdAEYNACABQaABRg0AQQAhAiABQf0ARw0BC0EAKALQCSECAkACQANAIAAvAQAhASAAIAJNDQECQCABQXdqQQVJDQAgAUEgRg0AIAFBoAFGDQACQCABQSlGDQAgAUHdAEYNACABQf0ARw0EC0EBDwsgAEF+aiEADAALC0EBIQIgAUEpRg0BIAFB3QBGDQEgAUH9AEYNAQsgARAvQQFzIQILIAILRgEDf0EAIQMCQCAAIAJBAXQiAmsiBEECaiIAQQAoAtAJIgVJDQAgACABIAIQNg0AAkAgACAFRw0AQQEPCyAEEC4hAwsgAwuDAQECf0EBIQECQAJAAkACQAJAAkAgAC8BACICQUVqDgQFBAQBAAsCQCACQZt/ag4EAwQEAgALIAJBKUYNBCACQfkARw0DIABBfmpBsglBBhAlDwsgAEF+ai8BAEE9Rg8LIABBfmpBqglBBBAlDwsgAEF+akG+CUEDECUPC0EAIQELIAELtAMBAn9BACEBAkACQAJAAkACQAJAAkACQAJAAkAgAC8BAEGcf2oOFAABAgkJCQkDCQkEBQkJBgkHCQkICQsCQAJAIABBfmovAQBBl39qDgQACgoBCgsgAEF8akHACEECECUPCyAAQXxqQcQIQQMQJQ8LAkACQAJAIABBfmovAQBBjX9qDgMAAQIKCwJAIABBfGovAQAiAkHhAEYNACACQewARw0KIABBempB5QAQMA8LIABBempB4wAQMA8LIABBfGpByghBBBAlDwsgAEF8akHSCEEGECUPCyAAQX5qLwEAQe8ARw0GIABBfGovAQBB5QBHDQYCQCAAQXpqLwEAIgJB8ABGDQAgAkHjAEcNByAAQXhqQd4IQQYQJQ8LIABBeGpB6ghBAhAlDwsgAEF+akHuCEEEECUPC0EBIQEgAEF+aiIAQekAEDANBCAAQfYIQQUQJQ8LIABBfmpB5AAQMA8LIABBfmpBgAlBBxAlDwsgAEF+akGOCUEEECUPCwJAIABBfmovAQAiAkHvAEYNACACQeUARw0BIABBfGpB7gAQMA8LIABBfGpBlglBAxAlIQELIAELNAEBf0EBIQECQCAAQXdqQf//A3FBBUkNACAAQYABckGgAUYNACAAQS5HIAAQL3EhAQsgAQswAQF/AkACQCAAQXdqIgFBF0sNAEEBIAF0QY2AgARxDQELIABBoAFGDQBBAA8LQQELTgECf0EAIQECQAJAIAAvAQAiAkHlAEYNACACQesARw0BIABBfmpB7ghBBBAlDwsgAEF+ai8BAEH1AEcNACAAQXxqQdIIQQYQJSEBCyABC94BAQR/QQAoAqgKIQBBACgCrAohAQJAAkACQANAIAAiAkECaiEAIAIgAU8NAQJAAkACQCAALwEAIgNBpH9qDgUCAwMDAQALIANBJEcNAiACLwEEQfsARw0CQQAgAkEEaiIANgKoCkEAQQAvAZIKIgJBAWo7AZIKQQAoApwKIAJBA3RqIgJBBDYCACACIAA2AgQPC0EAIAA2AqgKQQBBAC8BkgpBf2oiADsBkgpBACgCnAogAEH//wNxQQN0aigCAEEDRw0DDAQLIAJBBGohAAwACwtBACAANgKoCgsQLQsLcAECfwJAAkADQEEAQQAoAqgKIgBBAmoiATYCqAogAEEAKAKsCk8NAQJAAkACQCABLwEAIgFBpX9qDgIBAgALAkAgAUF2ag4EBAMDBAALIAFBL0cNAgwECxA1GgwBC0EAIABBBGo2AqgKDAALCxAtCws1AQF/QQBBAToA8AlBACgCqAohAEEAQQAoAqwKQQJqNgKoCkEAIABBACgC0AlrQQF1NgKECgtDAQJ/QQEhAQJAIAAvAQAiAkF3akH//wNxQQVJDQAgAkGAAXJBoAFGDQBBACEBIAIQL0UNACACQS5HIAAQMXIPCyABC2gBAn9BASEBAkACQCAAQV9qIgJBBUsNAEEBIAJ0QTFxDQELIABB+P8DcUEoRg0AIABBRmpB//8DcUEGSQ0AAkAgAEGlf2oiAkEDSw0AIAJBAUcNAQsgAEGFf2pB//8DcUEESSEBCyABCz0BAn9BACECAkBBACgC0AkiAyAASw0AIAAvAQAgAUcNAAJAIAMgAEcNAEEBDwsgAEF+ai8BABAoIQILIAILMQEBf0EAIQECQCAALwEAQS5HDQAgAEF+ai8BAEEuRw0AIABBfGovAQBBLkYhAQsgAQvbBAEFfwJAIAFBIkYNACABQSdGDQAQLQ8LQQAoAqgKIQMgARAhIAAgA0ECakEAKAKoCkEAKALECRABAkAgAkEBSA0AQQAoAuQJQQRBBiACQQFGGzYCHAtBAEEAKAKoCkECajYCqApBABAgIQJBACgCqAohAQJAAkAgAkH3AEcNACABLwECQekARw0AIAEvAQRB9ABHDQAgAS8BBkHoAEYNAQtBACABQX5qNgKoCg8LQQAgAUEIajYCqAoCQEEBECBB+wBGDQBBACABNgKoCg8LQQAoAqgKIgQhA0EAIQADQEEAIANBAmo2AqgKAkACQAJAAkBBARAgIgJBJ0cNAEEAKAKoCiEFQScQIUEAKAKoCkECaiEDDAELQQAoAqgKIQUgAkEiRw0BQSIQIUEAKAKoCkECaiEDC0EAIAM2AqgKQQEQICECDAELIAIQMyECQQAoAqgKIQMLAkAgAkE6Rg0AQQAgATYCqAoPC0EAQQAoAqgKQQJqNgKoCgJAQQEQICICQSJGDQAgAkEnRg0AQQAgATYCqAoPC0EAKAKoCiEGIAIQIUEAQQAoAvwJIgJBFGo2AvwJQQAoAqgKIQcgAiAFNgIAIAJBADYCECACIAY2AgggAiADNgIEIAIgB0ECajYCDEEAQQAoAqgKQQJqNgKoCiAAQRBqQQAoAuQJQSBqIAAbIAI2AgACQAJAQQEQICIAQSxGDQAgAEH9AEYNAUEAIAE2AqgKDwtBAEEAKAKoCkECaiIDNgKoCiACIQAMAQsLQQAoAuQJIgEgBDYCECABQQAoAqgKQQJqNgIMC20BAn8CQAJAA0ACQCAAQf//A3EiAUF3aiICQRdLDQBBASACdEGfgIAEcQ0CCyABQaABRg0BIAAhAiABEC8NAkEAIQJBAEEAKAKoCiIAQQJqNgKoCiAALwECIgANAAwCCwsgACECCyACQf//A3ELqwEBBH8CQAJAQQAoAqgKIgIvAQAiA0HhAEYNACABIQQgACEFDAELQQAgAkEEajYCqApBARAgIQJBACgCqAohBQJAAkAgAkEiRg0AIAJBJ0YNACACEDMaQQAoAqgKIQQMAQsgAhAhQQBBACgCqApBAmoiBDYCqAoLQQEQICEDQQAoAqgKIQILAkAgAiAFRg0AIAUgBEEAIAAgACABRiICG0EAIAEgAhsQAgsgAwtyAQR/QQAoAqgKIQBBACgCrAohAQJAAkADQCAAQQJqIQIgACABTw0BAkACQCACLwEAIgNBpH9qDgIBBAALIAIhACADQXZqDgQCAQECAQsgAEEEaiEADAALC0EAIAI2AqgKEC1BAA8LQQAgAjYCqApB3QALSQEDf0EAIQMCQCACRQ0AAkADQCAALQAAIgQgAS0AACIFRw0BIAFBAWohASAAQQFqIQAgAkF/aiICDQAMAgsLIAQgBWshAwsgAwsL4gECAEGACAvEAQAAeABwAG8AcgB0AG0AcABvAHIAdABmAG8AcgBlAHQAYQBvAHUAcgBjAGUAcgBvAG0AdQBuAGMAdABpAG8AbgB2AG8AeQBpAGUAZABlAGwAZQBjAG8AbgB0AGkAbgBpAG4AcwB0AGEAbgB0AHkAYgByAGUAYQByAGUAdAB1AHIAZABlAGIAdQBnAGcAZQBhAHcAYQBpAHQAaAByAHcAaABpAGwAZQBpAGYAYwBhAHQAYwBmAGkAbgBhAGwAbABlAGwAcwAAQcQJCxABAAAAAgAAAAAEAAAwOQAA", "undefined" != typeof Buffer ? Buffer.from(A, "base64") : Uint8Array.from(atob(A), ((A2) => A2.charCodeAt(0)));
  var A;
};
WebAssembly.compile(E()).then(WebAssembly.instantiate).then((({ exports: A }) => {
}));
const __vite_import_meta_env__ = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://dentalempireos.com", "SSR": true };
function getActionContext(context) {
  const callerInfo = getCallerInfo(context);
  const actionResultAlreadySet = Boolean(context.locals._actionPayload);
  let action = void 0;
  if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) {
    action = {
      calledFrom: callerInfo.from,
      name: callerInfo.name,
      handler: async () => {
        const pipeline = Reflect.get(context, pipelineSymbol);
        const callerInfoName = shouldAppendForwardSlash(
          pipeline.manifest.trailingSlash,
          pipeline.manifest.buildFormat
        ) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
        let baseAction;
        try {
          baseAction = await pipeline.getAction(callerInfoName);
        } catch (error2) {
          if (error2 instanceof Error && "name" in error2 && typeof error2.name === "string" && error2.name === ActionNotFoundError.name) {
            return { data: void 0, error: new ActionError({ code: "NOT_FOUND" }) };
          }
          throw error2;
        }
        const bodySizeLimit = pipeline.manifest.actionBodySizeLimit;
        let input;
        try {
          input = await parseRequestBody(context.request, bodySizeLimit);
        } catch (e) {
          if (e instanceof ActionError) {
            return { data: void 0, error: e };
          }
          if (e instanceof TypeError) {
            return { data: void 0, error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" }) };
          }
          throw e;
        }
        const omitKeys = ["props", "getActionResult", "callAction", "redirect"];
        const actionAPIContext = Object.create(
          Object.getPrototypeOf(context),
          Object.fromEntries(
            Object.entries(Object.getOwnPropertyDescriptors(context)).filter(
              ([key]) => !omitKeys.includes(key)
            )
          )
        );
        Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
        const handler = baseAction.bind(actionAPIContext);
        return handler(input);
      }
    };
  }
  function setActionResult(actionName, actionResult) {
    context.locals._actionPayload = {
      actionResult,
      actionName
    };
  }
  return {
    action,
    setActionResult,
    serializeActionResult,
    deserializeActionResult
  };
}
function getCallerInfo(ctx) {
  if (ctx.routePattern === ACTION_RPC_ROUTE_PATTERN) {
    return { from: "rpc", name: ctx.url.pathname.replace(/^.*\/_actions\//, "") };
  }
  const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
  if (queryParam) {
    return { from: "form", name: queryParam };
  }
  return void 0;
}
async function parseRequestBody(request, bodySizeLimit) {
  const contentType = request.headers.get("content-type");
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
  const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
  if (!contentType) return void 0;
  if (hasContentLength && contentLength > bodySizeLimit) {
    throw new ActionError({
      code: "CONTENT_TOO_LARGE",
      message: `Request body exceeds ${bodySizeLimit} bytes`
    });
  }
  try {
    if (hasContentType(contentType, formContentTypes)) {
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        const formRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: toArrayBuffer(body)
        });
        return await formRequest.formData();
      }
      return await request.clone().formData();
    }
    if (hasContentType(contentType, ["application/json"])) {
      if (contentLength === 0) return void 0;
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        if (body.byteLength === 0) return void 0;
        return JSON.parse(new TextDecoder().decode(body));
      }
      return await request.clone().json();
    }
  } catch (e) {
    if (e instanceof BodySizeLimitError) {
      throw new ActionError({
        code: "CONTENT_TOO_LARGE",
        message: `Request body exceeds ${bodySizeLimit} bytes`
      });
    }
    throw e;
  }
  throw new TypeError("Unsupported content type");
}
const ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
const formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
  const type = contentType.split(";")[0].toLowerCase();
  return expected.some((t) => type === t);
}
function serializeActionResult(res) {
  if (res.error) {
    if (Object.assign(__vite_import_meta_env__, { OS: "Windows_NT", _: "C:/Program Files/nodejs/node.exe" })?.DEV) {
      actionResultErrorStack.set(res.error.stack);
    }
    let body2;
    if (res.error instanceof ActionInputError) {
      body2 = {
        type: res.error.type,
        issues: res.error.issues,
        fields: res.error.fields
      };
    } else {
      body2 = {
        ...res.error,
        message: res.error.message
      };
    }
    return {
      type: "error",
      status: res.error.status,
      contentType: "application/json",
      body: JSON.stringify(body2)
    };
  }
  if (res.data === void 0) {
    return {
      type: "empty",
      status: 204
    };
  }
  let body;
  try {
    body = stringify$2(res.data, {
      // Add support for URL objects
      URL: (value) => value instanceof URL && value.href
    });
  } catch (e) {
    let hint = ActionsReturnedInvalidDataError.hint;
    if (res.data instanceof Response) {
      hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
    }
    throw new AstroError({
      ...ActionsReturnedInvalidDataError,
      message: ActionsReturnedInvalidDataError.message(String(e)),
      hint
    });
  }
  return {
    type: "data",
    status: 200,
    contentType: "application/json+devalue",
    body
  };
}
function toArrayBuffer(buffer2) {
  const copy = new Uint8Array(buffer2.byteLength);
  copy.set(buffer2);
  return copy.buffer;
}
function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    const action = baseAction.bind(context);
    return action(input);
  };
}
var dist = {};
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.parseCookie = parseCookie;
  dist.parse = parseCookie;
  dist.stringifyCookie = stringifyCookie;
  dist.stringifySetCookie = stringifySetCookie;
  dist.serialize = stringifySetCookie;
  dist.parseSetCookie = parseSetCookie;
  dist.stringifySetCookie = stringifySetCookie;
  dist.serialize = stringifySetCookie;
  const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
  const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
  const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
  const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
  const maxAgeRegExp = /^-?\d+$/;
  const __toString = Object.prototype.toString;
  const NullObject = /* @__PURE__ */ (() => {
    const C = function() {
    };
    C.prototype = /* @__PURE__ */ Object.create(null);
    return C;
  })();
  function parseCookie(str, options) {
    const obj = new NullObject();
    const len = str.length;
    if (len < 2)
      return obj;
    const dec = options?.decode || decode;
    let index = 0;
    do {
      const eqIdx = eqIndex(str, index, len);
      if (eqIdx === -1)
        break;
      const endIdx = endIndex(str, index, len);
      if (eqIdx > endIdx) {
        index = str.lastIndexOf(";", eqIdx - 1) + 1;
        continue;
      }
      const key = valueSlice(str, index, eqIdx);
      if (obj[key] === void 0) {
        obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
      }
      index = endIdx + 1;
    } while (index < len);
    return obj;
  }
  function stringifyCookie(cookie, options) {
    const enc = options?.encode || encodeURIComponent;
    const cookieStrings = [];
    for (const name of Object.keys(cookie)) {
      const val = cookie[name];
      if (val === void 0)
        continue;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`cookie name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`cookie val is invalid: ${val}`);
      }
      cookieStrings.push(`${name}=${value}`);
    }
    return cookieStrings.join("; ");
  }
  function stringifySetCookie(_name, _val, _opts) {
    const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
    const options = typeof _val === "object" ? _val : _opts;
    const enc = options?.encode || encodeURIComponent;
    if (!cookieNameRegExp.test(cookie.name)) {
      throw new TypeError(`argument name is invalid: ${cookie.name}`);
    }
    const value = cookie.value ? enc(cookie.value) : "";
    if (!cookieValueRegExp.test(value)) {
      throw new TypeError(`argument val is invalid: ${cookie.value}`);
    }
    let str = cookie.name + "=" + value;
    if (cookie.maxAge !== void 0) {
      if (!Number.isInteger(cookie.maxAge)) {
        throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
      }
      str += "; Max-Age=" + cookie.maxAge;
    }
    if (cookie.domain) {
      if (!domainValueRegExp.test(cookie.domain)) {
        throw new TypeError(`option domain is invalid: ${cookie.domain}`);
      }
      str += "; Domain=" + cookie.domain;
    }
    if (cookie.path) {
      if (!pathValueRegExp.test(cookie.path)) {
        throw new TypeError(`option path is invalid: ${cookie.path}`);
      }
      str += "; Path=" + cookie.path;
    }
    if (cookie.expires) {
      if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
        throw new TypeError(`option expires is invalid: ${cookie.expires}`);
      }
      str += "; Expires=" + cookie.expires.toUTCString();
    }
    if (cookie.httpOnly) {
      str += "; HttpOnly";
    }
    if (cookie.secure) {
      str += "; Secure";
    }
    if (cookie.partitioned) {
      str += "; Partitioned";
    }
    if (cookie.priority) {
      const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
      switch (priority) {
        case "low":
          str += "; Priority=Low";
          break;
        case "medium":
          str += "; Priority=Medium";
          break;
        case "high":
          str += "; Priority=High";
          break;
        default:
          throw new TypeError(`option priority is invalid: ${cookie.priority}`);
      }
    }
    if (cookie.sameSite) {
      const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
      switch (sameSite) {
        case true:
        case "strict":
          str += "; SameSite=Strict";
          break;
        case "lax":
          str += "; SameSite=Lax";
          break;
        case "none":
          str += "; SameSite=None";
          break;
        default:
          throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
      }
    }
    return str;
  }
  function parseSetCookie(str, options) {
    const dec = options?.decode || decode;
    const len = str.length;
    const endIdx = endIndex(str, 0, len);
    const eqIdx = eqIndex(str, 0, endIdx);
    const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
      name: valueSlice(str, 0, eqIdx),
      value: dec(valueSlice(str, eqIdx + 1, endIdx))
    };
    let index = endIdx + 1;
    while (index < len) {
      const endIdx2 = endIndex(str, index, len);
      const eqIdx2 = eqIndex(str, index, endIdx2);
      const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
      const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
      switch (attr.toLowerCase()) {
        case "httponly":
          setCookie.httpOnly = true;
          break;
        case "secure":
          setCookie.secure = true;
          break;
        case "partitioned":
          setCookie.partitioned = true;
          break;
        case "domain":
          setCookie.domain = val;
          break;
        case "path":
          setCookie.path = val;
          break;
        case "max-age":
          if (val && maxAgeRegExp.test(val))
            setCookie.maxAge = Number(val);
          break;
        case "expires":
          if (!val)
            break;
          const date = new Date(val);
          if (Number.isFinite(date.valueOf()))
            setCookie.expires = date;
          break;
        case "priority":
          if (!val)
            break;
          const priority = val.toLowerCase();
          if (priority === "low" || priority === "medium" || priority === "high") {
            setCookie.priority = priority;
          }
          break;
        case "samesite":
          if (!val)
            break;
          const sameSite = val.toLowerCase();
          if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
            setCookie.sameSite = sameSite;
          }
          break;
      }
      index = endIdx2 + 1;
    }
    return setCookie;
  }
  function endIndex(str, min, len) {
    const index = str.indexOf(";", min);
    return index === -1 ? len : index;
  }
  function eqIndex(str, min, max) {
    const index = str.indexOf("=", min);
    return index < max ? index : -1;
  }
  function valueSlice(str, min, max) {
    let start = min;
    let end = max;
    do {
      const code = str.charCodeAt(start);
      if (code !== 32 && code !== 9)
        break;
    } while (++start < end);
    while (end > start) {
      const code = str.charCodeAt(end - 1);
      if (code !== 32 && code !== 9)
        break;
      end--;
    }
    return str.slice(start, end);
  }
  function decode(str) {
    if (str.indexOf("%") === -1)
      return str;
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  }
  function isDate(val) {
    return __toString.call(val) === "[object Date]";
  }
  return dist;
}
var distExports = /* @__PURE__ */ requireDist();
const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
const identity = (value) => value;
class AstroCookie {
  value;
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false") return false;
    if (this.value === "0") return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  #request;
  #requestValues;
  #outgoing;
  #consumed;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
    this.#consumed = false;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const {
      // @ts-expect-error
      maxAge: _ignoredMaxAge,
      // @ts-expect-error
      expires: _ignoredExpires,
      ...sanitizedOptions
    } = options || {};
    const serializeOptions = {
      expires: DELETED_EXPIRATION,
      ...sanitizedOptions
    };
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      distExports.serialize(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const decode = options?.decode ?? decodeURIComponent;
    const values = this.#ensureParsed();
    if (key in values) {
      const value = values[key];
      if (value) {
        let decodedValue;
        try {
          decodedValue = decode(value);
        } catch (_error) {
          decodedValue = value;
        }
        return new AstroCookie(decodedValue);
      }
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @param _options This parameter is no longer used.
   * @returns
   */
  has(key, _options) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed();
    return values[key] !== void 0;
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    if (this.#consumed) {
      const warning = new Error(
        "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
      );
      warning.name = "Warning";
      console.warn(warning);
    }
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      distExports.serialize(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Merges a new AstroCookies instance into the current instance. Any new cookies
   * will be added to the current instance, overwriting any existing cookies with the same name.
   */
  merge(cookies) {
    const outgoing = cookies.#outgoing;
    if (outgoing) {
      for (const [key, value] of outgoing) {
        this.#ensureOutgoingMap().set(key, value);
      }
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null) return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  /**
   * Marks the cookies as consumed and returns the header values.
   * After consumption, any subsequent `set()` calls will warn.
   */
  consume() {
    this.#consumed = true;
    return this.headers();
  }
  /**
   * @deprecated Use the instance method `cookies.consume()` instead.
   * Kept for backward compatibility with adapters.
   */
  static consume(cookies) {
    return cookies.consume();
  }
  #ensureParsed() {
    if (!this.#requestValues) {
      this.#parse();
    }
    if (!this.#requestValues) {
      this.#requestValues = /* @__PURE__ */ Object.create(null);
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse() {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = distExports.parse(raw, { decode: identity });
  }
}
const astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of cookies.consume()) {
    yield headerValue;
  }
  return [];
}
function deduplicateDirectiveValues(existingDirective, newDirective) {
  const [directiveName, ...existingValues] = existingDirective.split(/\s+/).filter(Boolean);
  const [newDirectiveName, ...newValues] = newDirective.split(/\s+/).filter(Boolean);
  if (directiveName !== newDirectiveName) {
    return void 0;
  }
  const finalDirectives = Array.from(/* @__PURE__ */ new Set([...existingValues, ...newValues]));
  return `${directiveName} ${finalDirectives.join(" ")}`;
}
function pushDirective(directives, newDirective) {
  if (directives.length === 0) {
    return [newDirective];
  }
  const finalDirectives = [];
  let matched = false;
  for (const directive of directives) {
    if (matched) {
      finalDirectives.push(directive);
      continue;
    }
    const result = deduplicateDirectiveValues(directive, newDirective);
    if (result) {
      finalDirectives.push(result);
      matched = true;
    } else {
      finalDirectives.push(directive);
    }
  }
  if (!matched) {
    finalDirectives.push(newDirective);
  }
  return finalDirectives;
}
function computeFallbackRoute(options) {
  const {
    pathname,
    responseStatus,
    fallback,
    fallbackType,
    locales,
    defaultLocale,
    strategy,
    base
  } = options;
  if (responseStatus !== 404) {
    return { type: "none" };
  }
  if (!fallback || Object.keys(fallback).length === 0) {
    return { type: "none" };
  }
  const segments = pathname.split("/");
  const urlLocale = segments.find((segment) => {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (locale === segment) {
          return true;
        }
      } else if (locale.path === segment) {
        return true;
      }
    }
    return false;
  });
  if (!urlLocale) {
    return { type: "none" };
  }
  const fallbackKeys = Object.keys(fallback);
  if (!fallbackKeys.includes(urlLocale)) {
    return { type: "none" };
  }
  const fallbackLocale = fallback[urlLocale];
  const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
  let newPathname;
  if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
    if (pathname.includes(`${base}`)) {
      newPathname = pathname.replace(`/${urlLocale}`, ``);
    } else {
      newPathname = pathname.replace(`/${urlLocale}`, `/`);
    }
  } else {
    newPathname = pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
  }
  return {
    type: fallbackType,
    pathname: newPathname
  };
}
class I18nRouter {
  #strategy;
  #defaultLocale;
  #locales;
  #base;
  #domains;
  constructor(options) {
    this.#strategy = options.strategy;
    this.#defaultLocale = options.defaultLocale;
    this.#locales = options.locales;
    this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
    this.#domains = options.domains;
  }
  /**
   * Evaluate routing strategy for a pathname.
   * Returns decision object (not HTTP Response).
   */
  match(pathname, context) {
    if (this.shouldSkipProcessing(pathname, context)) {
      return { type: "continue" };
    }
    switch (this.#strategy) {
      case "manual":
        return { type: "continue" };
      case "pathname-prefix-always":
        return this.matchPrefixAlways(pathname, context);
      case "domains-prefix-always":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixAlways(pathname, context);
      case "pathname-prefix-other-locales":
        return this.matchPrefixOtherLocales(pathname, context);
      case "domains-prefix-other-locales":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixOtherLocales(pathname, context);
      case "pathname-prefix-always-no-redirect":
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      case "domains-prefix-always-no-redirect":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      default:
        return { type: "continue" };
    }
  }
  /**
   * Check if i18n processing should be skipped for this request
   */
  shouldSkipProcessing(pathname, context) {
    if (pathname.includes("/404") || pathname.includes("/500")) {
      return true;
    }
    if (pathname.includes("/_server-islands/")) {
      return true;
    }
    if (context.isReroute) {
      return true;
    }
    if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") {
      return true;
    }
    return false;
  }
  /**
   * Strategy: pathname-prefix-always
   * All locales must have a prefix, including the default locale.
   */
  matchPrefixAlways(pathname, _context) {
    const isRoot = pathname === this.#base + "/" || pathname === this.#base;
    if (isRoot) {
      const basePrefix = this.#base === "/" ? "" : this.#base;
      return {
        type: "redirect",
        location: `${basePrefix}/${this.#defaultLocale}`
      };
    }
    if (!pathHasLocale(pathname, this.#locales)) {
      return { type: "notFound" };
    }
    return { type: "continue" };
  }
  /**
   * Strategy: pathname-prefix-other-locales
   * Default locale has no prefix, other locales must have a prefix.
   */
  matchPrefixOtherLocales(pathname, _context) {
    let pathnameContainsDefaultLocale = false;
    for (const segment of pathname.split("/")) {
      if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
        pathnameContainsDefaultLocale = true;
        break;
      }
    }
    if (pathnameContainsDefaultLocale) {
      const newLocation = pathname.replace(`/${this.#defaultLocale}`, "");
      return {
        type: "notFound",
        location: newLocation
      };
    }
    return { type: "continue" };
  }
  /**
   * Strategy: pathname-prefix-always-no-redirect
   * Like prefix-always but allows root to serve instead of redirecting
   */
  matchPrefixAlwaysNoRedirect(pathname, _context) {
    const isRoot = pathname === this.#base + "/" || pathname === this.#base;
    if (isRoot) {
      return { type: "continue" };
    }
    if (!pathHasLocale(pathname, this.#locales)) {
      return { type: "notFound" };
    }
    return { type: "continue" };
  }
  /**
   * Check if the current locale doesn't belong to the configured domain.
   * Used for domain-based routing strategies.
   */
  localeHasntDomain(currentLocale, currentDomain) {
    if (!this.#domains || !currentDomain) {
      return false;
    }
    if (!currentLocale) {
      return false;
    }
    const localesForDomain = this.#domains[currentDomain];
    if (!localesForDomain) {
      return true;
    }
    return !localesForDomain.includes(currentLocale);
  }
}
class I18n {
  #i18n;
  #base;
  #trailingSlash;
  #format;
  #router;
  constructor(i18n, base, trailingSlash, format) {
    this.#i18n = i18n;
    this.#base = base;
    this.#trailingSlash = trailingSlash;
    this.#format = format;
    this.#router = new I18nRouter({
      strategy: i18n.strategy,
      defaultLocale: i18n.defaultLocale,
      locales: i18n.locales,
      base,
      domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce(
        (acc, domain2) => {
          const locale = i18n.domainLookupTable[domain2];
          if (!acc[domain2]) {
            acc[domain2] = [];
          }
          acc[domain2].push(locale);
          return acc;
        },
        {}
      ) : void 0
    });
  }
  async finalize(state, response) {
    state.pipeline.usedFeatures |= PipelineFeatures.i18n;
    const i18n = this.#i18n;
    const typeHeader = response.headers.get(ROUTE_TYPE_HEADER);
    if (typeHeader) {
      response.headers.delete(ROUTE_TYPE_HEADER);
    }
    const isReroute = response.headers.get(REROUTE_DIRECTIVE_HEADER);
    if (isReroute === "no" && typeof i18n.fallback === "undefined") {
      return response;
    }
    if (typeHeader !== "page" && typeHeader !== "fallback") {
      return response;
    }
    const url = new URL(state.request.url);
    const currentLocale = state.computeCurrentLocale();
    const isPrerendered = state.routeData.prerender;
    const routerContext = {
      currentLocale,
      currentDomain: url.hostname,
      routeType: typeHeader,
      isReroute: isReroute === "yes"
    };
    const routeDecision = this.#router.match(url.pathname, routerContext);
    switch (routeDecision.type) {
      case "redirect": {
        let location = routeDecision.location;
        if (shouldAppendForwardSlash(this.#trailingSlash, this.#format)) {
          location = appendForwardSlash(location);
        }
        return new Response(null, {
          status: routeDecision.status ?? 302,
          headers: { Location: location }
        });
      }
      case "notFound": {
        if (isPrerendered) {
          const prerenderedRes = new Response(response.body, {
            status: 404,
            headers: response.headers
          });
          prerenderedRes.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
          if (routeDecision.location) {
            prerenderedRes.headers.set("Location", routeDecision.location);
          }
          return prerenderedRes;
        }
        const headers = new Headers();
        if (routeDecision.location) {
          headers.set("Location", routeDecision.location);
        }
        return new Response(null, { status: 404, headers });
      }
    }
    if (i18n.fallback && i18n.fallbackType) {
      const effectiveStatus = typeHeader === "fallback" ? 404 : response.status;
      const fallbackDecision = computeFallbackRoute({
        pathname: url.pathname,
        responseStatus: effectiveStatus,
        fallback: i18n.fallback,
        fallbackType: i18n.fallbackType,
        locales: i18n.locales,
        defaultLocale: i18n.defaultLocale,
        strategy: i18n.strategy,
        base: this.#base
      });
      switch (fallbackDecision.type) {
        case "redirect":
          return new Response(null, {
            status: 302,
            headers: { Location: fallbackDecision.pathname + url.search }
          });
        case "rewrite":
          return await state.rewrite(fallbackDecision.pathname + url.search);
      }
    }
    return response;
  }
}
function pathHasLocale(path, locales) {
  const segments = path.split("/").map(normalizeThePath);
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function normalizeThePath(path) {
  return path.endsWith(".html") ? path.slice(0, -5) : path;
}
function getAllCodes(locales) {
  const result = [];
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      result.push(loopLocale);
    } else {
      result.push(...loopLocale.codes);
    }
  }
  return result;
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      return Math.sign(b.qualityValue - a.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      outer: for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
            break;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentCode;
              break outer;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return getAllCodes(locales);
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(code);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/").map(normalizeThePath)) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale)) continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
  for (const locale of locales) {
    if (typeof locale === "string") {
      if (locale === defaultLocale) {
        return locale;
      }
    } else {
      if (locale.path === defaultLocale) {
        return locale.codes.at(0);
      }
    }
  }
}
function computeCurrentLocaleFromParams(params, locales) {
  const byNormalizedCode = /* @__PURE__ */ new Map();
  const byPath = /* @__PURE__ */ new Map();
  for (const locale of locales) {
    if (typeof locale === "string") {
      byNormalizedCode.set(normalizeTheLocale(locale), locale);
    } else {
      byPath.set(locale.path, locale.codes[0]);
      for (const code of locale.codes) {
        byNormalizedCode.set(normalizeTheLocale(code), code);
      }
    }
  }
  for (const value of Object.values(params)) {
    if (!value) continue;
    const pathMatch = byPath.get(value);
    if (pathMatch) return pathMatch;
    const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
    if (codeMatch) return codeMatch;
  }
}
async function callMiddleware(onRequest, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  };
  const middlewarePromise = onRequest(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}
const EMPTY_OPTIONS = Object.freeze({ tags: [] });
class NoopAstroCache {
  enabled = false;
  set() {
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
  }
}
let hasWarned = false;
class DisabledAstroCache {
  enabled = false;
  #logger;
  constructor(logger) {
    this.#logger = logger;
  }
  #warn() {
    if (!hasWarned) {
      hasWarned = true;
      this.#logger?.warn(
        "cache",
        "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `experimental.cache` to enable caching."
      );
    }
  }
  set() {
    this.#warn();
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
    throw new AstroError(CacheNotEnabled);
  }
}
class AstroMiddleware {
  #pipeline;
  constructor(pipeline) {
    this.#pipeline = pipeline;
  }
  async handle(state, renderRouteCallback) {
    state.pipeline.usedFeatures |= PipelineFeatures.middleware;
    const pipeline = this.#pipeline;
    await state.getProps();
    const apiContext = state.getAPIContext();
    state.counter++;
    if (state.counter === 4) {
      return new Response("Loop Detected", {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
        status: 508,
        statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
      });
    }
    const next = async (ctx, payload) => {
      if (payload) {
        pipeline.logger.debug("router", "Called rewriting to:", payload);
        const result = await pipeline.tryRewrite(payload, state.request);
        applyRewriteToState(state, payload, result);
      }
      return renderRouteCallback(state, ctx);
    };
    let response;
    if (state.skipMiddleware) {
      response = await next(apiContext);
    } else {
      const pipelineMiddleware = await pipeline.getMiddleware();
      const composed = sequence(...pipeline.internalMiddleware, pipelineMiddleware);
      response = await callMiddleware(composed, apiContext, next);
    }
    response = this.#finalize(state, response);
    state.response = response;
    return response;
  }
  #finalize(state, response) {
    attachCookiesToResponse(response, state.cookies);
    return response;
  }
}
const EMPTY_SLOTS = Object.freeze({});
class PagesHandler {
  #pipeline;
  constructor(pipeline) {
    this.#pipeline = pipeline;
  }
  async handle(state, ctx) {
    const pipeline = this.#pipeline;
    const { logger, streaming } = pipeline;
    let response;
    const componentInstance = await state.loadComponentInstance();
    switch (state.routeData.type) {
      case "endpoint": {
        response = await renderEndpoint(
          componentInstance,
          ctx,
          state.routeData.prerender,
          logger
        );
        break;
      }
      case "page": {
        const props = await state.getProps();
        const actionApiContext = state.getActionAPIContext();
        const result = await state.createResult(componentInstance, actionApiContext);
        try {
          response = await renderPage(
            result,
            componentInstance?.default,
            props,
            state.slots ?? EMPTY_SLOTS,
            streaming,
            state.routeData
          );
        } catch (e) {
          result.cancelled = true;
          throw e;
        }
        response.headers.set(ROUTE_TYPE_HEADER, "page");
        if (state.routeData.route === "/404" || state.routeData.route === "/500") {
          response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
        }
        if (state.isRewriting) {
          response.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
        }
        break;
      }
      case "redirect": {
        return new Response(null, { status: 404, headers: { [ASTRO_ERROR_HEADER]: "true" } });
      }
      case "fallback": {
        return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
      }
    }
    const responseCookies = getCookiesFromResponse(response);
    if (responseCookies) {
      state.cookies.merge(responseCookies);
    }
    state.response = response;
    return response;
  }
}
function validateAndDecodePathname(pathname) {
  let decoded;
  try {
    decoded = decodeURI(pathname);
  } catch (_e) {
    throw new Error("Invalid URL encoding");
  }
  let iterations = 0;
  while (decoded !== pathname && iterations < 10) {
    pathname = decoded;
    try {
      decoded = decodeURI(pathname);
    } catch {
      break;
    }
    iterations++;
  }
  return decoded;
}
function createNormalizedUrl(requestUrl) {
  return normalizeUrl(new URL(requestUrl));
}
function normalizeUrl(url) {
  try {
    url.pathname = validateAndDecodePathname(url.pathname);
  } catch {
    try {
      url.pathname = decodeURI(url.pathname);
    } catch {
    }
  }
  url.pathname = collapseDuplicateSlashes(url.pathname);
  return url;
}
function applyRewriteToState(state, payload, { routeData, componentInstance, newUrl, pathname }, { mergeCookies = false } = {}) {
  const pipeline = state.pipeline;
  const oldPathname = state.pathname;
  const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
  if (pipeline.manifest.serverLike && !state.routeData.prerender && routeData.prerender && !isI18nFallback) {
    throw new AstroError({
      ...ForbiddenRewrite,
      message: ForbiddenRewrite.message(state.pathname, pathname, routeData.component),
      hint: ForbiddenRewrite.hint(routeData.component)
    });
  }
  state.routeData = routeData;
  state.componentInstance = componentInstance;
  if (payload instanceof Request) {
    state.request = payload;
  } else {
    state.request = copyRequest(
      newUrl,
      state.request,
      routeData.prerender,
      pipeline.logger,
      state.routeData.route
    );
  }
  state.url = createNormalizedUrl(state.request.url);
  if (mergeCookies) {
    const newCookies = new AstroCookies(state.request);
    if (state.cookies) {
      newCookies.merge(state.cookies);
    }
    state.cookies = newCookies;
  }
  state.params = getParams(routeData, pathname);
  state.pathname = pathname;
  state.isRewriting = true;
  state.status = 200;
  setOriginPathname(
    state.request,
    oldPathname,
    pipeline.manifest.trailingSlash,
    pipeline.manifest.buildFormat
  );
  state.invalidateContexts();
}
class Rewrites {
  async execute(state, payload) {
    const pipeline = state.pipeline;
    pipeline.logger.debug("router", "Calling rewrite: ", payload);
    const result = await pipeline.tryRewrite(payload, state.request);
    applyRewriteToState(state, payload, result, { mergeCookies: true });
    const middleware = new AstroMiddleware(pipeline);
    const pagesHandler = new PagesHandler(pipeline);
    return middleware.handle(state, pagesHandler.handle.bind(pagesHandler));
  }
}
function matchRoute(pathname, manifest2) {
  if (isRoute404(pathname)) {
    const errorRoute = manifest2.routes.find((route) => isRoute404(route.route));
    if (errorRoute) return errorRoute;
  }
  if (isRoute500(pathname)) {
    const errorRoute = manifest2.routes.find((route) => isRoute500(route.route));
    if (errorRoute) return errorRoute;
  }
  return manifest2.routes.find((route) => {
    return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
  });
}
function isRoute404or500(route) {
  return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
  return route.component === SERVER_ISLAND_COMPONENT;
}
function computePathnameFromDomain(request, url, i18n, base, trailingSlash, logger) {
  let pathname = void 0;
  if (i18n && (i18n.strategy === "domains-prefix-always" || i18n.strategy === "domains-prefix-other-locales" || i18n.strategy === "domains-prefix-always-no-redirect")) {
    let host = request.headers.get("X-Forwarded-Host");
    let protocol = request.headers.get("X-Forwarded-Proto");
    if (protocol) {
      protocol = protocol + ":";
    } else {
      protocol = url.protocol;
    }
    if (!host) {
      host = request.headers.get("Host");
    }
    if (host && protocol) {
      host = host.split(":")[0];
      try {
        let locale;
        const hostAsUrl = new URL(`${protocol}//${host}`);
        for (const [domainKey, localeValue] of Object.entries(i18n.domainLookupTable)) {
          const domainKeyAsUrl = new URL(domainKey);
          if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
            locale = localeValue;
            break;
          }
        }
        if (locale) {
          pathname = prependForwardSlash(
            joinPaths(normalizeTheLocale(locale), removeBase(url.pathname, base))
          );
          if (trailingSlash === "always") {
            pathname = appendForwardSlash(pathname);
          } else if (trailingSlash === "never") {
            pathname = removeTrailingForwardSlash(pathname);
          } else if (url.pathname.endsWith("/")) {
            pathname = appendForwardSlash(pathname);
          }
        }
      } catch (e) {
        logger.error(
          "router",
          `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
        );
        logger.error("router", `Error: ${e}`);
      }
    }
  }
  return pathname;
}
function removeBase(pathname, base) {
  pathname = collapseDuplicateLeadingSlashes(pathname);
  if (pathname.startsWith(base)) {
    return pathname.slice(removeTrailingForwardSlash(base).length + 1);
  }
  return pathname;
}
const renderOptionsSymbol = /* @__PURE__ */ Symbol.for("astro.renderOptions");
function getRenderOptions(request) {
  return Reflect.get(request, renderOptionsSymbol);
}
function setRenderOptions(request, options) {
  Reflect.set(request, renderOptionsSymbol, options);
}
function matchPattern(url, remotePattern) {
  return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
function matchPort(url, port) {
  return !port || port === url.port;
}
function matchProtocol(url, protocol) {
  return !protocol || protocol === url.protocol.slice(0, -1);
}
function matchHostname(url, hostname, allowWildcard = false) {
  if (!hostname) {
    return true;
  } else if (!allowWildcard || !hostname.startsWith("*")) {
    return hostname === url.hostname;
  } else if (hostname.startsWith("**.")) {
    const slicedHostname = hostname.slice(2);
    return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
  } else if (hostname.startsWith("*.")) {
    const slicedHostname = hostname.slice(1);
    if (!url.hostname.endsWith(slicedHostname)) {
      return false;
    }
    const subdomainWithDot = url.hostname.slice(0, -(slicedHostname.length - 1));
    return subdomainWithDot.endsWith(".") && !subdomainWithDot.slice(0, -1).includes(".");
  }
  return false;
}
function matchPathname(url, pathname, allowWildcard = false) {
  if (!pathname) {
    return true;
  } else if (!allowWildcard || !pathname.endsWith("*")) {
    return pathname === url.pathname;
  } else if (pathname.endsWith("/**")) {
    const slicedPathname = pathname.slice(0, -2);
    return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
  } else if (pathname.endsWith("/*")) {
    const slicedPathname = pathname.slice(0, -1);
    if (!url.pathname.startsWith(slicedPathname)) {
      return false;
    }
    const additionalPathChunks = url.pathname.slice(slicedPathname.length).split("/").filter(Boolean);
    return additionalPathChunks.length === 1;
  }
  return false;
}
function isRemoteAllowed(src, {
  domains,
  remotePatterns
}) {
  if (!URL.canParse(src)) {
    return false;
  }
  const url = new URL(src);
  if (!["http:", "https:", "data:"].includes(url.protocol)) {
    return false;
  }
  return domains.some((domain2) => matchHostname(url, domain2)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}
function getFirstForwardedValue$1(multiValueHeader) {
  return multiValueHeader?.toString().split(",").map((e) => e.trim())[0];
}
function sanitizeHost(hostname) {
  if (!hostname) return void 0;
  if (/[/\\]/.test(hostname)) return void 0;
  return hostname;
}
function parseHost(host) {
  const parts = host.split(":");
  return {
    hostname: parts[0],
    port: parts[1]
  };
}
function matchesAllowedDomains(hostname, protocol, port, allowedDomains) {
  const hostWithPort = port ? `${hostname}:${port}` : hostname;
  const urlString = `${protocol}://${hostWithPort}`;
  if (!URL.canParse(urlString)) {
    return false;
  }
  const testUrl = new URL(urlString);
  return allowedDomains.some((pattern) => matchPattern(testUrl, pattern));
}
function validateHost(host, protocol, allowedDomains) {
  if (!host || host.length === 0) return void 0;
  if (!allowedDomains || allowedDomains.length === 0) return void 0;
  const sanitized = sanitizeHost(host);
  if (!sanitized) return void 0;
  const { hostname, port } = parseHost(sanitized);
  if (matchesAllowedDomains(hostname, protocol, port, allowedDomains)) {
    return sanitized;
  }
  return void 0;
}
function validateForwardedHeaders(forwardedProtocol, forwardedHost, forwardedPort, allowedDomains) {
  const result = {};
  if (forwardedProtocol) {
    if (allowedDomains && allowedDomains.length > 0) {
      const hasProtocolPatterns = allowedDomains.some((pattern) => pattern.protocol !== void 0);
      if (hasProtocolPatterns) {
        try {
          const testUrl = new URL(`${forwardedProtocol}://example.com`);
          const isAllowed = allowedDomains.some(
            (pattern) => matchPattern(testUrl, { protocol: pattern.protocol })
          );
          if (isAllowed) {
            result.protocol = forwardedProtocol;
          }
        } catch {
        }
      } else if (/^https?$/.test(forwardedProtocol)) {
        result.protocol = forwardedProtocol;
      }
    }
  }
  if (forwardedPort && allowedDomains && allowedDomains.length > 0) {
    const hasPortPatterns = allowedDomains.some((pattern) => pattern.port !== void 0);
    if (hasPortPatterns) {
      const isAllowed = allowedDomains.some((pattern) => pattern.port === forwardedPort);
      if (isAllowed) {
        result.port = forwardedPort;
      }
    }
  }
  if (forwardedHost && forwardedHost.length > 0 && allowedDomains && allowedDomains.length > 0) {
    const protoForValidation = result.protocol || "https";
    const sanitized = sanitizeHost(forwardedHost);
    if (sanitized) {
      const { hostname, port: portFromHost } = parseHost(sanitized);
      const portForValidation = result.port || portFromHost;
      if (matchesAllowedDomains(hostname, protoForValidation, portForValidation, allowedDomains)) {
        result.host = sanitized;
      }
    }
  }
  return result;
}
class FetchState {
  pipeline;
  /**
   * The request to render. Mutated during rewrites so subsequent renders
   * see the rewritten URL.
   */
  request;
  routeData;
  /**
   * The pathname to use for routing and rendering. Starts out as the raw,
   * base-stripped, decoded pathname from the request. May be further
   * normalized by `AstroHandler` after routeData is known (in dev, when
   * the matched route has no `.html` extension, `.html` / `/index.html`
   * suffixes are stripped).
   */
  pathname;
  /** Resolved render options (addCookieHeader, clientAddress, locals, etc.). */
  renderOptions;
  /** When the request started, used to log duration. */
  timeStart;
  /**
   * The route's loaded component module. Set before middleware runs; may
   * be swapped during in-flight rewrites from inside the middleware chain.
   */
  componentInstance;
  /**
   * Slot overrides supplied by the container API. `undefined` for HTTP
   * requests — `PagesHandler` coalesces to `{}` on read so we don't
   * allocate an empty object per request.
   */
  slots;
  /**
   * The `Response` produced by handlers, if any. Set after page
   * rendering or middleware completes.
   */
  response;
  /**
   * Default HTTP status for the rendered response. Callers override
   * before rendering runs (e.g. `AstroHandler` sets this from
   * `BaseApp.getDefaultStatusCode`; error handlers set `404` / `500`).
   */
  status = 200;
  /** Whether user middleware should be skipped for this request. */
  skipMiddleware = false;
  /** A flag that tells the render content if the rewriting was triggered. */
  isRewriting = false;
  /** A safety net in case of loops (rewrite counter). */
  counter = 0;
  /** Cookies for this request. Created lazily on first access. */
  cookies;
  /** Route params derived from routeData + pathname. Computed lazily. */
  #params;
  get params() {
    if (!this.#params && this.routeData) {
      this.#params = getParams(this.routeData, this.pathname);
    }
    return this.#params;
  }
  set params(value) {
    this.#params = value;
  }
  /** Normalized URL for this request. */
  url;
  /** Client address for this request. */
  clientAddress;
  /** Whether this is a partial render (container API). */
  partial;
  /** Whether to inject CSP meta tags. */
  shouldInjectCspMetaTags;
  /** Request-scoped locals object, shared with user middleware. */
  locals = {};
  /**
   * Memoized `props` (see `getProps`). `null` means "not yet computed"
   * — using `null` (rather than `undefined`) keeps the hidden class
   * stable and distinct from a valid-but-empty result.
   */
  props = null;
  /** Memoized `ActionAPIContext` (see `getActionAPIContext`). */
  actionApiContext = null;
  /** Memoized `APIContext` (see `getAPIContext`). */
  apiContext = null;
  /** Registered context providers keyed by name. Lazy-initialized on first provide(). */
  #providers;
  /** Cached values from resolved providers. Lazy-initialized on first resolve(). */
  #providersResolvedValues;
  /** Cached promise for lazy component instance loading. */
  #componentInstancePromise;
  /** SSR result for the current page render. */
  result;
  /** Initial props (from container/error handler). */
  initialProps = {};
  /** Rewrites handler instance. Lazy-initialized on first rewrite(). */
  #rewrites;
  /** Memoized Astro page partial. */
  #astroPagePartial;
  /**
   * Locale-prefixed pathname derived from the Host header for domain-based
   * i18n routing (e.g. `/en/boats/1/foo`), or `undefined` when the request
   * isn't served from a locale-mapped domain. When set, `this.pathname` is
   * derived from it so locale/param resolution match the route pattern.
   */
  #domainPathname;
  /** Memoized current locale. */
  #currentLocale;
  /** Memoized preferred locale. */
  #preferredLocale;
  /** Memoized preferred locale list. */
  #preferredLocaleList;
  constructor(pipeline, request, options) {
    this.pipeline = pipeline;
    this.request = request;
    options ??= getRenderOptions(request);
    this.routeData = options?.routeData;
    this.renderOptions = options ?? {
      addCookieHeader: false,
      clientAddress: void 0,
      locals: void 0,
      prerenderedErrorPageFetch: fetch,
      routeData: void 0,
      waitUntil: void 0
    };
    this.componentInstance = void 0;
    this.slots = void 0;
    const url = new URL(request.url);
    const domainPathname = computePathnameFromDomain(
      request,
      url,
      pipeline.manifest.i18n,
      pipeline.manifest.base,
      pipeline.manifest.trailingSlash,
      pipeline.logger
    );
    if (domainPathname) {
      this.#domainPathname = domainPathname;
      try {
        this.pathname = decodeURI(domainPathname);
      } catch {
        this.pathname = domainPathname;
      }
    } else {
      this.pathname = this.#computePathname(url);
    }
    this.timeStart = performance.now();
    this.clientAddress = options?.clientAddress;
    this.locals = options?.locals ?? {};
    this.url = normalizeUrl(url);
    this.cookies = new AstroCookies(request);
    if (pipeline.manifest.allowedDomains && pipeline.manifest.allowedDomains.length > 0) {
      this.#applyForwardedHeaders();
    }
    if (!Reflect.get(this.request, originPathnameSymbol)) {
      setOriginPathname(
        this.request,
        this.pathname,
        pipeline.manifest.trailingSlash,
        pipeline.manifest.buildFormat
      );
    }
    this.#resolveRouteData();
  }
  /**
   * Triggers a rewrite. Delegates to the Rewrites handler.
   */
  rewrite(payload) {
    return (this.#rewrites ??= new Rewrites()).execute(this, payload);
  }
  /**
   * Creates the SSR result for the current page render.
   */
  async createResult(mod, ctx) {
    const pipeline = this.pipeline;
    const { clientDirectives, inlinedScripts, compressHTML, manifest: manifest2, renderers: renderers2, resolve } = pipeline;
    const routeData = this.routeData;
    const { links, scripts, styles } = await pipeline.headElements(routeData);
    const extraStyleHashes = [];
    const extraScriptHashes = [];
    const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags ?? manifest2.shouldInjectCspMetaTags;
    const cspAlgorithm = manifest2.csp?.algorithm ?? "SHA-256";
    if (shouldInjectCspMetaTags) {
      for (const style of styles) {
        extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
      }
      for (const script of scripts) {
        extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
      }
    }
    const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest2.componentMetadata;
    const headers = new Headers({ "Content-Type": "text/html" });
    const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
    const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
    const status = this.status;
    const response = {
      status: actionResult?.error ? actionResult?.error.status : status,
      statusText: actionResult?.error ? actionResult?.error.type : "OK",
      get headers() {
        return headers;
      },
      set headers(_) {
        throw new AstroError(AstroResponseHeadersReassigned);
      }
    };
    const state = this;
    const result = {
      base: manifest2.base,
      userAssetsBase: manifest2.userAssetsBase,
      cancelled: false,
      clientDirectives,
      inlinedScripts,
      componentMetadata,
      compressHTML,
      cookies: this.cookies,
      createAstro: (props, slots) => state.createAstro(result, props, slots, ctx),
      links,
      // SAFETY: createResult is only called after route resolution, so routeData
      // is always set and the params getter always returns a value.
      params: this.params,
      partial,
      pathname: this.pathname,
      renderers: renderers2,
      resolve,
      response,
      request: this.request,
      scripts,
      styles,
      actionResult,
      async getServerIslandNameMap() {
        const serverIslands = await pipeline.getServerIslands();
        return serverIslands.serverIslandNameMap ?? /* @__PURE__ */ new Map();
      },
      key: manifest2.key,
      trailingSlash: manifest2.trailingSlash,
      _experimentalQueuedRendering: {
        pool: pipeline.nodePool,
        htmlStringCache: pipeline.htmlStringCache,
        enabled: manifest2.experimentalQueuedRendering?.enabled,
        poolSize: manifest2.experimentalQueuedRendering?.poolSize,
        contentCache: manifest2.experimentalQueuedRendering?.contentCache
      },
      _metadata: {
        hasHydrationScript: false,
        rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
        hasRenderedHead: false,
        renderedScripts: /* @__PURE__ */ new Set(),
        hasDirectives: /* @__PURE__ */ new Set(),
        hasRenderedServerIslandRuntime: false,
        headInTree: false,
        extraHead: [],
        extraStyleHashes,
        extraScriptHashes,
        propagators: /* @__PURE__ */ new Set(),
        templateDepth: 0
      },
      cspDestination: manifest2.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
      shouldInjectCspMetaTags,
      cspAlgorithm,
      scriptHashes: manifest2.csp?.scriptHashes ? [...manifest2.csp.scriptHashes] : [],
      scriptResources: manifest2.csp?.scriptResources ? [...manifest2.csp.scriptResources] : [],
      styleHashes: manifest2.csp?.styleHashes ? [...manifest2.csp.styleHashes] : [],
      styleResources: manifest2.csp?.styleResources ? [...manifest2.csp.styleResources] : [],
      directives: manifest2.csp?.directives ? [...manifest2.csp.directives] : [],
      isStrictDynamic: manifest2.csp?.isStrictDynamic ?? false,
      internalFetchHeaders: manifest2.internalFetchHeaders
    };
    this.result = result;
    return result;
  }
  /**
   * Creates the Astro global object for a component render.
   */
  createAstro(result, props, slotValues, apiContext) {
    let astroPagePartial;
    if (this.isRewriting) {
      this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
    }
    this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
    astroPagePartial = this.#astroPagePartial;
    const astroComponentPartial = { props, self: null };
    const Astro = Object.assign(
      Object.create(astroPagePartial),
      astroComponentPartial
    );
    let _slots;
    Object.defineProperty(Astro, "slots", {
      get: () => {
        if (!_slots) {
          _slots = new Slots(
            result,
            slotValues,
            this.pipeline.logger
          );
        }
        return _slots;
      }
    });
    return Astro;
  }
  /**
   * Creates the Astro page-level partial (prototype for Astro global).
   */
  createAstroPagePartial(result, apiContext) {
    const state = this;
    const { cookies, locals, params, pipeline, url } = this;
    const { response } = result;
    const redirect = (path, status = 302) => {
      if (state.request[responseSentSymbol$1]) {
        throw new AstroError({
          ...ResponseSentError
        });
      }
      return new Response(null, { status, headers: { Location: path } });
    };
    const rewrite = async (reroutePayload) => {
      return await state.rewrite(reroutePayload);
    };
    const callAction = createCallAction(apiContext);
    const partial = {
      generator: ASTRO_GENERATOR,
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      cookies,
      get clientAddress() {
        return state.getClientAddress();
      },
      get currentLocale() {
        return state.computeCurrentLocale();
      },
      params,
      get preferredLocale() {
        return state.computePreferredLocale();
      },
      get preferredLocaleList() {
        return state.computePreferredLocaleList();
      },
      locals,
      redirect,
      rewrite,
      request: this.request,
      response,
      site: pipeline.site,
      getActionResult: createGetActionResult(locals),
      get callAction() {
        return callAction;
      },
      url,
      get originPathname() {
        return getOriginPathname(state.request);
      },
      get csp() {
        return state.getCsp();
      },
      get logger() {
        return {
          info(msg) {
            pipeline.logger.info(null, msg);
          },
          warn(msg) {
            pipeline.logger.warn(null, msg);
          },
          error(msg) {
            pipeline.logger.error(null, msg);
          }
        };
      }
    };
    this.defineProviderGetters(partial);
    return partial;
  }
  getClientAddress() {
    const { pipeline, clientAddress } = this;
    const routeData = this.routeData;
    if (routeData.prerender) {
      throw new AstroError({
        ...PrerenderClientAddressNotAvailable,
        message: PrerenderClientAddressNotAvailable.message(routeData.component)
      });
    }
    if (clientAddress) {
      return clientAddress;
    }
    if (pipeline.adapterName) {
      throw new AstroError({
        ...ClientAddressNotAvailable,
        message: ClientAddressNotAvailable.message(pipeline.adapterName)
      });
    }
    throw new AstroError(StaticClientAddressNotAvailable);
  }
  getCookies() {
    return this.cookies;
  }
  getCsp() {
    const state = this;
    const { pipeline } = this;
    if (!pipeline.manifest.csp) {
      if (pipeline.runtimeMode === "production") {
        pipeline.logger.warn(
          "csp",
          `context.csp was used when rendering the route ${s.green(state.routeData.route)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/configuration-reference/#securitycsp`
        );
      }
      return void 0;
    }
    return {
      insertDirective(payload) {
        if (state.result) {
          state.result.directives = pushDirective(state.result.directives, payload);
        }
      },
      insertScriptResource(resource) {
        state.result?.scriptResources.push(resource);
      },
      insertStyleResource(resource) {
        state.result?.styleResources.push(resource);
      },
      insertStyleHash(hash) {
        state.result?.styleHashes.push(hash);
      },
      insertScriptHash(hash) {
        state.result?.scriptHashes.push(hash);
      }
    };
  }
  computeCurrentLocale() {
    const {
      url,
      pipeline: { i18n },
      routeData
    } = this;
    if (!i18n || !routeData) return;
    const { defaultLocale, locales, strategy } = i18n;
    const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
    if (this.#currentLocale) {
      return this.#currentLocale;
    }
    let computedLocale;
    if (isRouteServerIsland(routeData)) {
      let referer = this.request.headers.get("referer");
      if (referer) {
        if (URL.canParse(referer)) {
          referer = new URL(referer).pathname;
        }
        computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
      }
    } else {
      let pathname = routeData.pathname;
      if (this.#domainPathname) {
        pathname = this.pathname;
      } else if (url && !routeData.pattern.test(url.pathname)) {
        for (const fallbackRoute of routeData.fallbackRoutes) {
          if (fallbackRoute.pattern.test(url.pathname)) {
            pathname = fallbackRoute.pathname;
            break;
          }
        }
      }
      pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname ?? this.pathname;
      computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
      if (routeData.params.length > 0) {
        const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
        if (localeFromParams) {
          computedLocale = localeFromParams;
        }
      }
    }
    this.#currentLocale = computedLocale ?? fallbackTo;
    return this.#currentLocale;
  }
  computePreferredLocale() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
  }
  computePreferredLocaleList() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
  }
  /**
   * Lazily loads the route's component module. Returns the cached
   * instance if already loaded. The promise is cached so concurrent
   * callers share the same load.
   */
  async loadComponentInstance() {
    if (this.componentInstance) return this.componentInstance;
    if (this.#componentInstancePromise) return this.#componentInstancePromise;
    this.#componentInstancePromise = this.pipeline.getComponentByRoute(this.routeData).then((mod) => {
      this.componentInstance = mod;
      return mod;
    });
    return this.#componentInstancePromise;
  }
  /**
   * Registers a context provider under the given key. Handlers call
   * this to contribute values to the request context (e.g. sessions).
   * The `create` factory is called lazily on the first `resolve(key)`.
   */
  provide(key, provider) {
    (this.#providers ??= /* @__PURE__ */ new Map()).set(key, provider);
  }
  /**
   * Lazily resolves a provider registered under `key`. Calls
   * `provider.create()` on first access and caches the result.
   * Returns `undefined` if no provider was registered for the key.
   */
  resolve(key) {
    if (this.#providersResolvedValues?.has(key)) {
      return this.#providersResolvedValues.get(key);
    }
    const provider = this.#providers?.get(key);
    if (!provider) return void 0;
    const value = provider.create();
    (this.#providersResolvedValues ??= /* @__PURE__ */ new Map()).set(key, value);
    return value;
  }
  /**
   * Runs all registered `finalize` callbacks. Should be called after
   * the response is produced, typically in a `finally` block.
   *
   * Returns synchronously (no promise allocation) when nothing needs
   * finalizing — important for the hot path where sessions are not used.
   */
  finalizeAll() {
    if (!this.#providersResolvedValues || this.#providersResolvedValues.size === 0) return;
    let chain;
    for (const [key, provider] of this.#providers) {
      if (provider.finalize && this.#providersResolvedValues.has(key)) {
        const result = provider.finalize(this.#providersResolvedValues.get(key));
        if (result) {
          chain = chain ? chain.then(() => result) : result;
        }
      }
    }
    return chain;
  }
  /**
   * Adds lazy getters to `target` for each registered provider key.
   * Used by context creation (APIContext, Astro global) so that
   * provider values like `session` and `cache` appear as properties
   * without hard-coding the keys.
   */
  defineProviderGetters(target) {
    if (!this.#providers) return;
    const state = this;
    for (const key of this.#providers.keys()) {
      Object.defineProperty(target, key, {
        get: () => state.resolve(key),
        enumerable: true,
        configurable: true
      });
    }
  }
  /**
   * Resolves the route to use for this request and stores it on
   * `this.routeData`. If the adapter (or the dev server) provided a
   * `routeData` via render options it's already set and this is a
   * no-op. Otherwise we use the app's synchronous route matcher and
   * fall back to a `404.astro` route so middleware can still run.
   *
   * Called eagerly from the constructor so individual handlers
   * (actions, pages, middleware, etc.) always see a resolved route
   * without the caller needing an extra setup step.
   *
   * Once routeData is known, finalizes `this.pathname`: in dev, if the
   * matched route has no `.html` extension, strip `.html` / `/index.html`
   * suffixes so the rendering pipeline sees the canonical pathname.
   */
  /**
   * Strip `.html` / `/index.html` suffixes from the pathname so the
   * rendering pipeline sees the canonical route path. Only applies to
   * page routes where `.html` is framework-injected. Endpoint routes
   * preserve `.html` because any such suffix is user-provided (e.g.
   * from `getStaticPaths` params). Skipped when the matched route
   * itself has an `.html` extension in its definition.
   */
  #stripHtmlExtension() {
    if (this.routeData && this.routeData.type === "page" && !routeHasHtmlExtension(this.routeData)) {
      this.pathname = this.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    }
  }
  #resolveRouteData() {
    const pipeline = this.pipeline;
    if (this.routeData) {
      this.#stripHtmlExtension();
      return;
    }
    const matched = pipeline.matchRoute(this.pathname);
    if (matched && matched.prerender && pipeline.manifest.serverLike) {
      if (matched.params.length > 0) {
        const allMatches = pipeline.matchAllRoutes(this.pathname);
        this.routeData = allMatches.find((r) => !r.prerender);
      } else {
        this.routeData = void 0;
      }
    } else {
      this.routeData = matched;
    }
    pipeline.logger.debug("router", "Astro matched the following route for " + this.request.url);
    pipeline.logger.debug("router", "RouteData:\n" + this.routeData);
    if (!this.routeData) {
      const custom404 = getCustom404Route(pipeline.manifestData);
      if (custom404 && !custom404.prerender) {
        this.routeData = custom404;
      }
    }
    if (!this.routeData) {
      pipeline.logger.debug("router", "Astro hasn't found routes that match " + this.request.url);
      pipeline.logger.debug("router", "Here's the available routes:\n", pipeline.manifestData);
      return;
    }
    this.#stripHtmlExtension();
  }
  /**
   * Strips the pipeline's base from the request URL, prepends a forward
   * slash, and decodes the pathname. Falls back to the raw (not decoded)
   * pathname if `decodeURI` throws.
   *
   * Mirrors `BaseApp.removeBase`, including the
   * `collapseDuplicateLeadingSlashes` fix that prevents middleware
   * authorization bypass when the URL starts with `//`.
   */
  #computePathname(url) {
    let pathname = collapseDuplicateLeadingSlashes(url.pathname);
    const base = this.pipeline.manifest.base;
    if (pathname.startsWith(base)) {
      const baseWithoutTrailingSlash = removeTrailingForwardSlash(base);
      pathname = pathname.slice(baseWithoutTrailingSlash.length + 1);
    }
    pathname = prependForwardSlash(pathname);
    try {
      return validateAndDecodePathname(pathname);
    } catch (e) {
      this.pipeline.logger.error(null, e.toString());
      return pathname;
    }
  }
  /**
   * Reads X-Forwarded-Proto, X-Forwarded-Host, and X-Forwarded-Port
   * from the request headers, validates them against the manifest's
   * `allowedDomains`, and updates `this.url` accordingly. Also resolves
   * `clientAddress` from X-Forwarded-For when the host is trusted.
   *
   * Only called when `allowedDomains` is configured — without it,
   * forwarded headers are never trusted.
   */
  #applyForwardedHeaders() {
    const headers = this.request.headers;
    const allowedDomains = this.pipeline.manifest.allowedDomains;
    const validated = validateForwardedHeaders(
      getFirstForwardedValue$1(headers.get("x-forwarded-proto") ?? void 0),
      getFirstForwardedValue$1(headers.get("x-forwarded-host") ?? void 0),
      getFirstForwardedValue$1(headers.get("x-forwarded-port") ?? void 0),
      allowedDomains
    );
    if (!validated.protocol && !validated.host && !validated.port) return;
    if (validated.protocol) {
      this.url.protocol = validated.protocol + ":";
    }
    if (validated.host) {
      const colonIdx = validated.host.indexOf(":");
      if (colonIdx !== -1) {
        this.url.hostname = validated.host.slice(0, colonIdx);
        this.url.port = validated.host.slice(colonIdx + 1);
      } else {
        this.url.hostname = validated.host;
        this.url.port = "";
      }
    }
    if (validated.port) {
      this.url.port = validated.port;
    }
    const hostTrusted = validated.host !== void 0;
    if (hostTrusted && !this.clientAddress) {
      const forwardedFor = getFirstForwardedValue$1(
        this.request.headers.get("x-forwarded-for") ?? void 0
      );
      if (forwardedFor) {
        this.clientAddress = forwardedFor;
      }
    }
    const oldRequest = this.request;
    this.request = new Request(this.url, oldRequest);
    const app2 = Reflect.get(oldRequest, appSymbol);
    if (app2 !== void 0) {
      Reflect.set(this.request, appSymbol, app2);
    }
  }
  /**
   * Returns the resolved `props` for this render, computing them lazily
   * from the route + component module on first access. If the
   * `initialProps` already carries user-supplied props (e.g. the
   * container API) those are used verbatim.
   */
  async getProps() {
    if (this.props !== null) return this.props;
    if (Object.keys(this.initialProps).length > 0) {
      this.props = this.initialProps;
      return this.props;
    }
    const pipeline = this.pipeline;
    const mod = await this.loadComponentInstance();
    this.props = await getProps({
      mod,
      routeData: this.routeData,
      routeCache: pipeline.routeCache,
      pathname: this.pathname,
      logger: pipeline.logger,
      serverLike: pipeline.manifest.serverLike,
      base: pipeline.manifest.base,
      trailingSlash: pipeline.manifest.trailingSlash
    });
    return this.props;
  }
  /**
   * Returns the `ActionAPIContext` for this render, creating it lazily.
   * Used by middleware, actions, and page dispatch.
   */
  getActionAPIContext() {
    if (this.actionApiContext !== null) return this.actionApiContext;
    const state = this;
    const ctx = {
      get cookies() {
        return state.cookies;
      },
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      get clientAddress() {
        return state.getClientAddress();
      },
      get currentLocale() {
        return state.computeCurrentLocale();
      },
      generator: ASTRO_GENERATOR,
      get locals() {
        return state.locals;
      },
      set locals(_) {
        throw new AstroError(LocalsReassigned);
      },
      // SAFETY: getActionAPIContext is only called after route resolution,
      // so routeData is always set and the params getter always returns a value.
      params: this.params,
      get preferredLocale() {
        return state.computePreferredLocale();
      },
      get preferredLocaleList() {
        return state.computePreferredLocaleList();
      },
      request: this.request,
      site: this.pipeline.site,
      url: this.url,
      get originPathname() {
        return getOriginPathname(state.request);
      },
      get csp() {
        return state.getCsp();
      },
      get logger() {
        if (!state.pipeline.manifest.experimentalLogger) {
          state.pipeline.logger.warn(
            null,
            "The Astro.logger is available only when experimental.logger is defined."
          );
          return void 0;
        }
        return {
          info(msg) {
            state.pipeline.logger.info(null, msg);
          },
          warn(msg) {
            state.pipeline.logger.warn(null, msg);
          },
          error(msg) {
            state.pipeline.logger.error(null, msg);
          }
        };
      }
    };
    this.defineProviderGetters(ctx);
    this.actionApiContext = ctx;
    return this.actionApiContext;
  }
  /**
   * Returns the `APIContext` for this render, creating it lazily from
   * the memoized props + action context.
   *
   * Callers must ensure `getProps()` has resolved at least once before
   * calling this.
   */
  getAPIContext() {
    if (this.apiContext !== null) return this.apiContext;
    const actionApiContext = this.getActionAPIContext();
    const state = this;
    const redirect = (path, status = 302) => new Response(null, { status, headers: { Location: path } });
    const rewrite = async (reroutePayload) => {
      return await state.rewrite(reroutePayload);
    };
    Reflect.set(actionApiContext, pipelineSymbol, this.pipeline);
    actionApiContext[fetchStateSymbol] = this;
    this.apiContext = Object.assign(actionApiContext, {
      props: this.props,
      redirect,
      rewrite,
      getActionResult: createGetActionResult(actionApiContext.locals),
      callAction: createCallAction(actionApiContext)
    });
    return this.apiContext;
  }
  /**
   * Invalidates the cached `APIContext` so the next `getAPIContext()`
   * call re-derives it from the (possibly mutated) state. Used
   * after an in-flight rewrite swaps the route / request / params.
   */
  invalidateContexts() {
    this.props = null;
    this.actionApiContext = null;
    this.apiContext = null;
  }
}
class ActionHandler {
  /**
   * Run action handling for the current request. Expects the APIContext
   * that is already being used by the render pipeline.
   *
   * Returns a `Response` when the action fully handles the request (RPC),
   * or `undefined` when the caller should continue processing the
   * request (form actions or non-action requests).
   */
  handle(apiContext, state) {
    state.pipeline.usedFeatures |= PipelineFeatures.actions;
    if (apiContext.isPrerendered) {
      return void 0;
    }
    const { action, setActionResult } = getActionContext(apiContext);
    if (!action) {
      return void 0;
    }
    return this.#executeAction(action, setActionResult);
  }
  async #executeAction(action, setActionResult) {
    const actionResult = await action.handler();
    const serialized = serializeActionResult(actionResult);
    if (action.calledFrom === "rpc") {
      if (serialized.type === "empty") {
        return new Response(null, {
          status: serialized.status
        });
      }
      return new Response(serialized.body, {
        status: serialized.status,
        headers: {
          "Content-Type": serialized.contentType
        }
      });
    }
    setActionResult(action.name, serialized);
    return void 0;
  }
}
function prepareResponse(response, { addCookieHeader }) {
  for (const headerName of INTERNAL_RESPONSE_HEADERS) {
    if (response.headers.has(headerName)) {
      response.headers.delete(headerName);
    }
  }
  if (addCookieHeader) {
    for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) {
      response.headers.append("set-cookie", setCookieHeaderValue);
    }
  }
  Reflect.set(response, responseSentSymbol$1, true);
}
function redirectTemplate({
  status,
  absoluteLocation,
  relativeLocation,
  from
}) {
  const delay = status === 302 ? 2 : 0;
  const rel = escape(String(relativeLocation));
  const abs = escape(String(absoluteLocation));
  const fromHtml = from ? `from <code>${escape(from)}</code> ` : "";
  return `<!doctype html>
<title>Redirecting to: ${rel}</title>
<meta http-equiv="refresh" content="${delay};url=${rel}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${abs}">
<body>
	<a href="${rel}">Redirecting ${fromHtml}to <code>${rel}</code></a>
</body>`;
}
class TrailingSlashHandler {
  #app;
  constructor(app2) {
    this.#app = app2;
  }
  /**
   * Returns a redirect `Response` if the request pathname needs
   * normalization, or `undefined` if no redirect is required.
   */
  handle(state) {
    const url = new URL(state.request.url);
    const redirect = this.#redirectTrailingSlash(url.pathname);
    if (redirect === url.pathname) {
      return void 0;
    }
    const addCookieHeader = state.renderOptions.addCookieHeader;
    const status = state.request.method === "GET" ? 301 : 308;
    const response = new Response(
      redirectTemplate({
        status,
        relativeLocation: url.pathname,
        absoluteLocation: redirect,
        from: state.request.url
      }),
      {
        status,
        headers: {
          location: redirect + url.search
        }
      }
    );
    prepareResponse(response, { addCookieHeader });
    return response;
  }
  #redirectTrailingSlash(pathname) {
    const { trailingSlash } = this.#app.manifest;
    if (pathname === "/" || isInternalPath(pathname)) {
      return pathname;
    }
    const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
    if (path !== pathname) {
      return path;
    }
    if (trailingSlash === "ignore") {
      return pathname;
    }
    if (trailingSlash === "always" && !hasFileExtension(pathname)) {
      return appendForwardSlash(pathname);
    }
    if (trailingSlash === "never") {
      return removeTrailingForwardSlash(pathname);
    }
    return pathname;
  }
}
function defaultSetHeaders(options) {
  const headers = new Headers();
  const directives = [];
  if (options.maxAge !== void 0) {
    directives.push(`max-age=${options.maxAge}`);
  }
  if (options.swr !== void 0) {
    directives.push(`stale-while-revalidate=${options.swr}`);
  }
  if (directives.length > 0) {
    headers.set("CDN-Cache-Control", directives.join(", "));
  }
  if (options.tags && options.tags.length > 0) {
    headers.set("Cache-Tag", options.tags.join(", "));
  }
  if (options.lastModified) {
    headers.set("Last-Modified", options.lastModified.toUTCString());
  }
  if (options.etag) {
    headers.set("ETag", options.etag);
  }
  return headers;
}
function isLiveDataEntry(value) {
  return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}
const APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
const IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
class AstroCache {
  #options = {};
  #tags = /* @__PURE__ */ new Set();
  #disabled = false;
  #provider;
  enabled = true;
  constructor(provider) {
    this.#provider = provider;
  }
  set(input) {
    if (input === false) {
      this.#disabled = true;
      this.#tags.clear();
      this.#options = {};
      return;
    }
    this.#disabled = false;
    let options;
    if (isLiveDataEntry(input)) {
      if (!input.cacheHint) return;
      options = input.cacheHint;
    } else {
      options = input;
    }
    if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
    if ("swr" in options && options.swr !== void 0)
      this.#options.swr = options.swr;
    if ("etag" in options && options.etag !== void 0)
      this.#options.etag = options.etag;
    if (options.lastModified !== void 0) {
      if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) {
        this.#options.lastModified = options.lastModified;
      }
    }
    if (options.tags) {
      for (const tag of options.tags) this.#tags.add(tag);
    }
  }
  get tags() {
    return [...this.#tags];
  }
  /**
   * Get the current cache options (read-only snapshot).
   * Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
   */
  get options() {
    return {
      ...this.#options,
      tags: this.tags
    };
  }
  async invalidate(input) {
    if (!this.#provider) {
      throw new AstroError(CacheNotEnabled);
    }
    let options;
    if (isLiveDataEntry(input)) {
      options = { tags: input.cacheHint?.tags ?? [] };
    } else {
      options = input;
    }
    return this.#provider.invalidate(options);
  }
  /** @internal */
  [APPLY_HEADERS](response) {
    if (this.#disabled) return;
    const finalOptions = { ...this.#options, tags: this.tags };
    if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
    const headers = this.#provider?.setHeaders?.(finalOptions) ?? defaultSetHeaders(finalOptions);
    for (const [key, value] of headers) {
      response.headers.set(key, value);
    }
  }
  /** @internal */
  get [IS_ACTIVE]() {
    return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
  }
}
function applyCacheHeaders(cache, response) {
  if (APPLY_HEADERS in cache) {
    cache[APPLY_HEADERS](response);
  }
}
const ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
const ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
  const result = [];
  part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
    if (!str) return;
    const dynamic = i % 2 === 1;
    const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
    if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) {
      throw new Error(`Invalid route ${file} — parameter name must match /^[a-zA-Z0-9_$]+$/`);
    }
    result.push({
      content,
      dynamic,
      spread: dynamic && ROUTE_SPREAD.test(content)
    });
  });
  return result;
}
function compileCacheRoutes(routes, base, trailingSlash) {
  const compiled = Object.entries(routes).map(([path, options]) => {
    const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s2) => getParts(s2, path));
    const pattern = getPattern(segments, base, trailingSlash);
    return { pattern, options, segments, route: path };
  });
  compiled.sort(
    (a, b) => routeComparator(
      { segments: a.segments, route: a.route, type: "page" },
      { segments: b.segments, route: b.route, type: "page" }
    )
  );
  return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
  for (const route of compiledRoutes) {
    if (route.pattern.test(pathname)) return route.options;
  }
  return null;
}
const CACHE_KEY = "cache";
function provideCache(state) {
  const pipeline = state.pipeline;
  if (!pipeline.cacheConfig) {
    state.provide(CACHE_KEY, {
      create: () => new DisabledAstroCache(pipeline.logger)
    });
    return;
  }
  if (pipeline.runtimeMode === "development") {
    state.provide(CACHE_KEY, {
      create: () => new NoopAstroCache()
    });
    return;
  }
  return provideCacheAsync(state, pipeline);
}
async function provideCacheAsync(state, pipeline) {
  const cacheProvider = await pipeline.getCacheProvider();
  state.provide(CACHE_KEY, {
    create() {
      const cache = new AstroCache(cacheProvider);
      if (pipeline.cacheConfig?.routes) {
        if (!pipeline.compiledCacheRoutes) {
          pipeline.compiledCacheRoutes = compileCacheRoutes(
            pipeline.cacheConfig.routes,
            pipeline.manifest.base,
            pipeline.manifest.trailingSlash
          );
        }
        const matched = matchCacheRoute(state.pathname, pipeline.compiledCacheRoutes);
        if (matched) {
          cache.set(matched);
        }
      }
      return cache;
    }
  });
}
class CacheHandler {
  #app;
  constructor(app2) {
    this.#app = app2;
  }
  async handle(state, next) {
    this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
    if (!this.#app.pipeline.cacheProvider) {
      return next();
    }
    const cache = state.resolve(CACHE_KEY);
    const cacheProvider = await this.#app.pipeline.getCacheProvider();
    if (cacheProvider?.onRequest) {
      const response2 = await cacheProvider.onRequest(
        {
          request: state.request,
          url: new URL(state.request.url),
          waitUntil: state.renderOptions.waitUntil
        },
        async () => {
          const res = await next();
          applyCacheHeaders(cache, res);
          return res;
        }
      );
      response2.headers.delete("CDN-Cache-Control");
      response2.headers.delete("Cache-Tag");
      return response2;
    }
    const response = await next();
    applyCacheHeaders(cache, response);
    return response;
  }
}
function isExternalURL(url) {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
  if (typeof redirect === "string") {
    return isExternalURL(redirect);
  } else {
    return isExternalURL(redirect.destination);
  }
}
function computeRedirectStatus(method, redirect, redirectRoute) {
  return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
  if (typeof redirectRoute !== "undefined") {
    const generate = getRouteGenerator(redirectRoute.segments, trailingSlash);
    return generate(params);
  } else if (typeof redirect === "string") {
    if (redirectIsExternal(redirect)) {
      return redirect;
    } else {
      let target = redirect;
      for (const param of Object.keys(params)) {
        const paramValue = params[param];
        target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
      }
      return target;
    }
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
async function renderRedirect(state) {
  state.pipeline.usedFeatures |= PipelineFeatures.redirects;
  const routeData = state.routeData;
  const { redirect, redirectRoute } = routeData;
  const status = computeRedirectStatus(state.request.method, redirect, redirectRoute);
  const headers = {
    location: encodeURI(
      resolveRedirectTarget(
        state.params,
        redirect,
        redirectRoute,
        state.pipeline.manifest.trailingSlash
      )
    )
  };
  if (redirect && redirectIsExternal(redirect)) {
    if (typeof redirect === "string") {
      return Response.redirect(redirect, status);
    } else {
      return Response.redirect(redirect.destination, status);
    }
  }
  return new Response(null, { status, headers });
}
const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error2) {
    if (options.strict) {
      throw error2;
    }
    return value;
  }
}
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error2) {
    return Promise.reject(error2);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify$1(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify$1(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}
function defineDriver(factory) {
  return factory;
}
const DRIVER_NAME = "memory";
const memory = defineDriver(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify$1(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify$1(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify$1(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}
const PERSIST_SYMBOL = /* @__PURE__ */ Symbol();
const DEFAULT_COOKIE_NAME = "astro-session";
const VALID_COOKIE_REGEX = /^[\w-]+$/;
const unflatten = (parsed, _) => {
  return unflatten$1(parsed, {
    URL: (href) => new URL(href)
  });
};
const stringify = (data, _) => {
  return stringify$2(data, {
    // Support URL objects
    URL: (val) => val instanceof URL && val.href
  });
};
class AstroSession {
  // The cookies object.
  #cookies;
  // The session configuration.
  #config;
  // The cookie config
  #cookieConfig;
  // The cookie name
  #cookieName;
  // The unstorage object for the session driver.
  #storage;
  #data;
  // The session ID. A v4 UUID.
  #sessionID;
  // Sessions to destroy. Needed because we won't have the old session ID after it's destroyed locally.
  #toDestroy = /* @__PURE__ */ new Set();
  // Session keys to delete. Used for partial data sets to avoid overwriting the deleted value.
  #toDelete = /* @__PURE__ */ new Set();
  // Whether the session is dirty and needs to be saved.
  #dirty = false;
  // Whether the session cookie has been set.
  #cookieSet = false;
  // Whether the session ID was sourced from a client cookie rather than freshly generated.
  #sessionIDFromCookie = false;
  // The local data is "partial" if it has not been loaded from storage yet and only
  // contains values that have been set or deleted in-memory locally.
  // We do this to avoid the need to block on loading data when it is only being set.
  // When we load the data from storage, we need to merge it with the local partial data,
  // preserving in-memory changes and deletions.
  #partial = true;
  // The driver factory function provided by the pipeline
  #driverFactory;
  static #sharedStorage = /* @__PURE__ */ new Map();
  constructor({
    cookies,
    config: config2,
    runtimeMode,
    driverFactory,
    mockStorage
  }) {
    if (!config2) {
      throw new AstroError({
        ...SessionStorageInitError,
        message: SessionStorageInitError.message(
          "No driver was defined in the session configuration and the adapter did not provide a default driver."
        )
      });
    }
    this.#cookies = cookies;
    this.#driverFactory = driverFactory;
    const { cookie: cookieConfig = DEFAULT_COOKIE_NAME, ...configRest } = config2;
    let cookieConfigObject;
    if (typeof cookieConfig === "object") {
      const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
      this.#cookieName = name;
      cookieConfigObject = rest;
    } else {
      this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
    }
    this.#cookieConfig = {
      sameSite: "lax",
      secure: runtimeMode === "production",
      path: "/",
      ...cookieConfigObject,
      httpOnly: true
    };
    this.#config = configRest;
    if (mockStorage) {
      this.#storage = mockStorage;
    }
  }
  /**
   * Gets a session value. Returns `undefined` if the session or value does not exist.
   */
  async get(key) {
    return (await this.#ensureData()).get(key)?.data;
  }
  /**
   * Checks if a session value exists.
   */
  async has(key) {
    return (await this.#ensureData()).has(key);
  }
  /**
   * Gets all session values.
   */
  async keys() {
    return (await this.#ensureData()).keys();
  }
  /**
   * Gets all session values.
   */
  async values() {
    return [...(await this.#ensureData()).values()].map((entry) => entry.data);
  }
  /**
   * Gets all session entries.
   */
  async entries() {
    return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
  }
  /**
   * Deletes a session value.
   */
  delete(key) {
    this.#data ??= /* @__PURE__ */ new Map();
    this.#data.delete(key);
    if (this.#partial) {
      this.#toDelete.add(key);
    }
    this.#dirty = true;
  }
  /**
   * Sets a session value. The session is created if it does not exist.
   */
  set(key, value, { ttl } = {}) {
    if (!key) {
      throw new AstroError({
        ...SessionStorageSaveError,
        message: "The session key was not provided."
      });
    }
    let cloned;
    try {
      cloned = unflatten(JSON.parse(stringify(value)));
    } catch (err) {
      throw new AstroError(
        {
          ...SessionStorageSaveError,
          message: `The session data for ${key} could not be serialized.`,
          hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
        },
        { cause: err }
      );
    }
    if (!this.#cookieSet) {
      this.#setCookie();
      this.#cookieSet = true;
    }
    this.#data ??= /* @__PURE__ */ new Map();
    const lifetime = ttl ?? this.#config.ttl;
    const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
    this.#data.set(key, {
      data: cloned,
      expires
    });
    this.#dirty = true;
  }
  /**
   * Destroys the session, clearing the cookie and storage if it exists.
   */
  destroy() {
    const sessionId = this.#sessionID ?? this.#cookies.get(this.#cookieName)?.value;
    if (sessionId) {
      this.#toDestroy.add(sessionId);
    }
    this.#cookies.delete(this.#cookieName, this.#cookieConfig);
    this.#sessionID = void 0;
    this.#data = void 0;
    this.#dirty = true;
  }
  /**
   * Regenerates the session, creating a new session ID. The existing session data is preserved.
   */
  async regenerate() {
    let data = /* @__PURE__ */ new Map();
    try {
      data = await this.#ensureData();
    } catch (err) {
      console.error("Failed to load session data during regeneration:", err);
    }
    const oldSessionId = this.#sessionID;
    this.#sessionID = crypto.randomUUID();
    this.#sessionIDFromCookie = false;
    this.#data = data;
    this.#dirty = true;
    await this.#setCookie();
    if (oldSessionId && this.#storage) {
      this.#storage.removeItem(oldSessionId).catch((err) => {
        console.error("Failed to remove old session data:", err);
      });
    }
  }
  // Persists the session data to storage.
  // This is called automatically at the end of the request.
  // Uses a symbol to prevent users from calling it directly.
  async [PERSIST_SYMBOL]() {
    if (!this.#dirty && !this.#toDestroy.size) {
      return;
    }
    const storage = await this.#ensureStorage();
    if (this.#dirty && this.#data) {
      const data = await this.#ensureData();
      this.#toDelete.forEach((key2) => data.delete(key2));
      const key = this.#ensureSessionID();
      let serialized;
      try {
        serialized = stringify(data);
      } catch (err) {
        throw new AstroError(
          {
            ...SessionStorageSaveError,
            message: SessionStorageSaveError.message(
              "The session data could not be serialized.",
              this.#config.driver
            )
          },
          { cause: err }
        );
      }
      await storage.setItem(key, serialized);
      this.#dirty = false;
    }
    if (this.#toDestroy.size > 0) {
      const cleanupPromises = [...this.#toDestroy].map(
        (sessionId) => storage.removeItem(sessionId).catch((err) => {
          console.error("Failed to clean up session %s:", sessionId, err);
        })
      );
      await Promise.all(cleanupPromises);
      this.#toDestroy.clear();
    }
  }
  get sessionID() {
    return this.#sessionID;
  }
  /**
   * Loads a session from storage with the given ID, and replaces the current session.
   * Any changes made to the current session will be lost.
   * This is not normally needed, as the session is automatically loaded using the cookie.
   * However it can be used to restore a session where the ID has been recorded somewhere
   * else (e.g. in a database).
   */
  async load(sessionID) {
    this.#sessionID = sessionID;
    this.#data = void 0;
    await this.#setCookie();
    await this.#ensureData();
  }
  /**
   * Sets the session cookie.
   */
  async #setCookie() {
    if (!VALID_COOKIE_REGEX.test(this.#cookieName)) {
      throw new AstroError({
        ...SessionStorageSaveError,
        message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
      });
    }
    const value = this.#ensureSessionID();
    this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
  }
  /**
   * Attempts to load the session data from storage, or creates a new data object if none exists.
   * If there is existing partial data, it will be merged into the new data object.
   */
  async #ensureData() {
    if (this.#data && !this.#partial) {
      return this.#data;
    }
    this.#data ??= /* @__PURE__ */ new Map();
    if (!this.#sessionID && !this.#cookies.get(this.#cookieName)?.value) {
      this.#partial = false;
      return this.#data;
    }
    const storage = await this.#ensureStorage();
    const raw = await storage.get(this.#ensureSessionID());
    if (!raw) {
      if (this.#sessionIDFromCookie) {
        this.#sessionID = crypto.randomUUID();
        this.#sessionIDFromCookie = false;
        if (this.#cookieSet) {
          await this.#setCookie();
        }
      }
      return this.#data;
    }
    try {
      const storedMap = unflatten(raw);
      if (!(storedMap instanceof Map)) {
        await this.destroy();
        throw new AstroError({
          ...SessionStorageInitError,
          message: SessionStorageInitError.message(
            "The session data was an invalid type.",
            this.#config.driver
          )
        });
      }
      const now = Date.now();
      for (const [key, value] of storedMap) {
        const expired = typeof value.expires === "number" && value.expires < now;
        if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) {
          this.#data.set(key, value);
        }
      }
      this.#partial = false;
      return this.#data;
    } catch (err) {
      await this.destroy();
      if (err instanceof AstroError) {
        throw err;
      }
      throw new AstroError(
        {
          ...SessionStorageInitError,
          message: SessionStorageInitError.message(
            "The session data could not be parsed.",
            this.#config.driver
          )
        },
        { cause: err }
      );
    }
  }
  /**
   * Returns the session ID, generating a new one if it does not exist.
   */
  #ensureSessionID() {
    if (!this.#sessionID) {
      const cookieValue = this.#cookies.get(this.#cookieName)?.value;
      if (cookieValue) {
        this.#sessionID = cookieValue;
        this.#sessionIDFromCookie = true;
      } else {
        this.#sessionID = crypto.randomUUID();
      }
    }
    return this.#sessionID;
  }
  /**
   * Ensures the storage is initialized.
   * This is called automatically when a storage operation is needed.
   */
  async #ensureStorage() {
    if (this.#storage) {
      return this.#storage;
    }
    if (AstroSession.#sharedStorage.has(this.#config.driver)) {
      this.#storage = AstroSession.#sharedStorage.get(this.#config.driver);
      return this.#storage;
    }
    if (!this.#driverFactory) {
      throw new AstroError({
        ...SessionStorageInitError,
        message: SessionStorageInitError.message(
          "Astro could not load the driver correctly. Does it exist?",
          this.#config.driver
        )
      });
    }
    const driver = this.#driverFactory;
    try {
      this.#storage = createStorage({
        driver: {
          ...driver(this.#config.options),
          // Unused methods
          hasItem() {
            return false;
          },
          getKeys() {
            return [];
          }
        }
      });
      AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
      return this.#storage;
    } catch (err) {
      throw new AstroError(
        {
          ...SessionStorageInitError,
          message: SessionStorageInitError.message("Unknown error", this.#config.driver)
        },
        { cause: err }
      );
    }
  }
}
const SESSION_KEY = "session";
function provideSession(state) {
  state.pipeline.usedFeatures |= PipelineFeatures.sessions;
  const pipeline = state.pipeline;
  const config2 = pipeline.manifest.sessionConfig;
  if (!config2) return;
  return provideSessionAsync(state, config2);
}
async function provideSessionAsync(state, config2) {
  const pipeline = state.pipeline;
  const driverFactory = await pipeline.getSessionDriver();
  if (!driverFactory) return;
  state.provide(SESSION_KEY, {
    create() {
      const cookies = state.cookies;
      return new AstroSession({
        cookies,
        config: config2,
        runtimeMode: pipeline.runtimeMode,
        driverFactory,
        mockStorage: null
      });
    },
    finalize(session) {
      return session[PERSIST_SYMBOL]();
    }
  });
}
class AstroHandler {
  #app;
  #trailingSlashHandler;
  #actionHandler;
  #astroMiddleware;
  #pagesHandler;
  #cacheHandler;
  /** Bound callback for the middleware chain — created once, reused per request. */
  #renderRouteCallback;
  /**
   * i18n post-processor. Only set when the app has i18n configured and
   * the strategy is not `manual` — for the manual strategy users wire
   * `astro:i18n.middleware(...)` into their own `onRequest`.
   */
  #i18n;
  /** Whether sessions are configured on the manifest. */
  #hasSession;
  constructor(app2) {
    this.#app = app2;
    this.#trailingSlashHandler = new TrailingSlashHandler(app2);
    this.#actionHandler = new ActionHandler();
    this.#astroMiddleware = new AstroMiddleware(app2.pipeline);
    this.#pagesHandler = new PagesHandler(app2.pipeline);
    this.#cacheHandler = new CacheHandler(app2);
    this.#renderRouteCallback = this.#actionsAndPages.bind(this);
    this.#hasSession = !!app2.manifest.sessionConfig;
    const i18n = app2.manifest.i18n;
    if (i18n && i18n.strategy !== "manual") {
      this.#i18n = new I18n(
        i18n,
        app2.manifest.base,
        app2.manifest.trailingSlash,
        app2.manifest.buildFormat
      );
    }
  }
  /**
   * Runs actions then pages — the callback at the bottom of the
   * middleware chain. Bound once in the constructor to avoid
   * per-request closure allocation.
   */
  #actionsAndPages(state, ctx) {
    if (!state.skipMiddleware) {
      const actionResult = this.#actionHandler.handle(ctx, state);
      if (actionResult) {
        return actionResult.then((response) => response ?? this.#pagesHandler.handle(state, ctx));
      }
    }
    return this.#pagesHandler.handle(state, ctx);
  }
  async handle(state) {
    state.pipeline.usedFeatures |= ALL_PIPELINE_FEATURES;
    const trailingSlashRedirect = this.#trailingSlashHandler.handle(state);
    if (trailingSlashRedirect) {
      return trailingSlashRedirect;
    }
    if (!state.routeData) {
      return this.#app.renderError(state.request, {
        ...state.renderOptions,
        status: 404,
        pathname: state.pathname
      });
    }
    return this.render(state);
  }
  /**
   * Renders a response for the given `FetchState`. Assumes
   * trailing-slash redirects and routeData resolution have already run.
   *
   * User-triggered rewrites (`Astro.rewrite` / `ctx.rewrite`) go through
   * `Rewrites.execute` on the current `FetchState` — they mutate the
   * existing state in place and re-run middleware + page dispatch.
   */
  async render(state) {
    const routeData = state.routeData;
    const pathname = state.pathname;
    const request = state.request;
    const { addCookieHeader } = state.renderOptions;
    const defaultStatus = this.#app.getDefaultStatusCode(routeData, pathname);
    state.status = defaultStatus;
    let response;
    try {
      const sessionP = this.#hasSession ? provideSession(state) : void 0;
      const cacheP = provideCache(state);
      if (sessionP || cacheP) await Promise.all([sessionP, cacheP]);
      state.pipeline.usedFeatures |= PipelineFeatures.sessions;
      if (routeData.type === "redirect") {
        const redirectResponse = await renderRedirect(state);
        this.#app.logThisRequest({
          pathname,
          method: request.method,
          statusCode: redirectResponse.status,
          isRewrite: false,
          timeStart: state.timeStart
        });
        prepareResponse(redirectResponse, { addCookieHeader });
        this.#app.pipeline.logger.flush();
        return redirectResponse;
      }
      if (!this.#app.pipeline.cacheProvider) {
        this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
        response = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
        if (this.#i18n) {
          response = await this.#i18n.finalize(state, response);
        }
      } else {
        const runPipeline = async () => {
          let res = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
          if (this.#i18n) {
            res = await this.#i18n.finalize(state, res);
          }
          return res;
        };
        response = await this.#cacheHandler.handle(state, runPipeline);
      }
      const isRewrite = response.headers.has(REWRITE_DIRECTIVE_HEADER_KEY);
      this.#app.logThisRequest({
        pathname,
        method: request.method,
        statusCode: response.status,
        isRewrite,
        timeStart: state.timeStart
      });
    } catch (err) {
      this.#app.logger.error(null, err.stack || err.message || String(err));
      return this.#app.renderError(request, {
        ...state.renderOptions,
        status: 500,
        error: err,
        pathname: state.pathname
      });
    } finally {
      const finalize = state.finalizeAll();
      if (finalize) await finalize;
    }
    if (REROUTABLE_STATUS_CODES.includes(response.status) && // If the body isn't null, that means the user sets the 404 status
    // but uses the current route to handle the 404
    response.body === null && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return this.#app.renderError(request, {
        ...state.renderOptions,
        response,
        status: response.status,
        // We don't have an error to report here. Passing null means we pass nothing intentionally
        // while undefined means there's no error
        error: response.status === 500 ? null : void 0,
        pathname: state.pathname
      });
    }
    prepareResponse(response, { addCookieHeader });
    this.#app.pipeline.logger.flush();
    return response;
  }
}
class DefaultFetchHandler {
  #app;
  #handler;
  constructor(app2) {
    this.#app = app2 ?? null;
    this.#handler = app2 ? new AstroHandler(app2) : null;
  }
  /**
   * Fast path: called directly by `BaseApp.render()` with pre-resolved
   * options, avoiding the `Reflect.set/get` round-trip through the request.
   */
  renderWithOptions(request, options) {
    if (!this.#app) {
      const app2 = Reflect.get(request, appSymbol);
      if (!app2) {
        throw new Error("No fetch handler provided.");
      }
      this.#app = app2;
      this.#handler = new AstroHandler(app2);
    }
    const state = new FetchState(this.#app.pipeline, request, options);
    return this.#handler.handle(state);
  }
  fetch = (request) => {
    if (!this.#app) {
      const app2 = Reflect.get(request, appSymbol);
      if (!app2) {
        throw new Error("No fetch handler provided.");
      }
      this.#app = app2;
      this.#handler = new AstroHandler(app2);
    }
    const state = new FetchState(this.#app.pipeline, request);
    if (!this.#handler) {
      throw new Error("No fetch handler provided.");
    }
    return this.#handler.handle(state);
  };
}
const fetchable = new DefaultFetchHandler();
class DefaultErrorHandler {
  #app;
  #astroMiddleware;
  #pagesHandler;
  constructor(app2) {
    this.#app = app2;
    this.#astroMiddleware = new AstroMiddleware(app2.pipeline);
    this.#pagesHandler = new PagesHandler(app2.pipeline);
  }
  async renderError(request, {
    status,
    response: originalResponse,
    skipMiddleware = false,
    error: error2,
    pathname,
    ...resolvedRenderOptions
  }) {
    const app2 = this.#app;
    const resolvedPathname = pathname ?? new FetchState(app2.pipeline, request).pathname;
    const errorRoutePath = `/${status}${app2.manifest.trailingSlash === "always" ? "/" : ""}`;
    const errorRouteData = matchRoute(errorRoutePath, app2.manifestData);
    const url = new URL(request.url);
    if (errorRouteData) {
      if (errorRouteData.prerender) {
        const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
        const allowedDomains = app2.manifest.allowedDomains;
        const validatedHost = validateHost(url.host, url.protocol.replace(":", ""), allowedDomains);
        const safeOrigin = validatedHost ? url.origin : `${url.protocol}//localhost`;
        const statusURL = new URL(
          `${app2.baseWithoutTrailingSlash}/${status}${maybeDotHtml}`,
          safeOrigin
        );
        if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) {
          try {
            const response2 = await resolvedRenderOptions.prerenderedErrorPageFetch(
              statusURL.toString()
            );
            const override = { status, removeContentEncodingHeaders: true };
            const newResponse = mergeResponses(response2, originalResponse, override);
            prepareResponse(newResponse, resolvedRenderOptions);
            return newResponse;
          } catch {
            const response2 = mergeResponses(new Response(null, { status }), originalResponse);
            prepareResponse(response2, resolvedRenderOptions);
            return response2;
          }
        }
      }
      const mod = await app2.pipeline.getComponentByRoute(errorRouteData);
      const errorState = new FetchState(app2.pipeline, request);
      errorState.skipMiddleware = skipMiddleware;
      errorState.clientAddress = resolvedRenderOptions.clientAddress;
      errorState.routeData = errorRouteData;
      errorState.pathname = resolvedPathname;
      errorState.status = status;
      errorState.componentInstance = mod;
      errorState.locals = resolvedRenderOptions.locals ?? {};
      errorState.initialProps = { error: error2 };
      try {
        await provideSession(errorState);
        const response2 = await this.#astroMiddleware.handle(
          errorState,
          this.#pagesHandler.handle.bind(this.#pagesHandler)
        );
        const newResponse = mergeResponses(response2, originalResponse);
        prepareResponse(newResponse, resolvedRenderOptions);
        return newResponse;
      } catch {
        if (skipMiddleware === false) {
          return this.renderError(request, {
            ...resolvedRenderOptions,
            status,
            response: originalResponse,
            skipMiddleware: true,
            pathname: resolvedPathname
          });
        }
      } finally {
        await errorState.finalizeAll();
      }
    }
    const response = mergeResponses(new Response(null, { status }), originalResponse);
    prepareResponse(response, resolvedRenderOptions);
    return response;
  }
}
function mergeResponses(newResponse, originalResponse, override) {
  let newResponseHeaders = newResponse.headers;
  if (override?.removeContentEncodingHeaders) {
    newResponseHeaders = new Headers(newResponseHeaders);
    newResponseHeaders.delete("Content-Encoding");
    newResponseHeaders.delete("Content-Length");
  }
  if (!originalResponse) {
    if (override !== void 0) {
      return new Response(newResponse.body, {
        status: override.status,
        statusText: newResponse.statusText,
        headers: newResponseHeaders
      });
    }
    return newResponse;
  }
  const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
  try {
    originalResponse.headers.delete("Content-type");
    originalResponse.headers.delete("Content-Length");
    originalResponse.headers.delete("Transfer-Encoding");
  } catch {
  }
  const newHeaders = new Headers();
  const seen = /* @__PURE__ */ new Set();
  for (const [name, value] of originalResponse.headers) {
    newHeaders.append(name, value);
    seen.add(name.toLowerCase());
  }
  for (const [name, value] of newResponseHeaders) {
    if (!seen.has(name.toLowerCase())) {
      newHeaders.append(name, value);
    }
  }
  const mergedResponse = new Response(newResponse.body, {
    status,
    statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
    // If you're looking at here for possible bugs, it means that it's not a bug.
    // With the middleware, users can meddle with headers, and we should pass to the 404/500.
    // If users see something weird, it's because they are setting some headers they should not.
    //
    // Although, we don't want it to replace the content-type, because the error page must return `text/html`
    headers: newHeaders
  });
  const originalCookies = getCookiesFromResponse(originalResponse);
  const newCookies = getCookiesFromResponse(newResponse);
  if (originalCookies) {
    if (newCookies) {
      for (const cookieValue of newCookies.consume()) {
        originalResponse.headers.append("set-cookie", cookieValue);
      }
    }
    attachCookiesToResponse(mergedResponse, originalCookies);
  } else if (newCookies) {
    attachCookiesToResponse(mergedResponse, newCookies);
  }
  return mergedResponse;
}
class BaseApp {
  manifest;
  manifestData;
  pipeline;
  #adapterLogger;
  baseWithoutTrailingSlash;
  /**
   * The handler that turns incoming `Request` objects into `Response`s.
   * Defaults to a `DefaultFetchHandler` pinned to this app and can be
   * overridden via `setFetchHandler` — typically by the bundled
   * entrypoint after importing `virtual:astro:fetchable`.
   */
  #fetchHandler;
  #errorHandler;
  /**
   * Whether a custom fetch handler (from `src/app.ts`) has been set
   * via `setFetchHandler`. When false, the `DefaultFetchHandler` is
   * in use and all features are implicitly active.
   */
  #hasCustomFetchHandler = false;
  /**
   * Whether the missing-feature check has already run. We only want
   * to warn once — after the first request in dev, or at build end.
   */
  #featureCheckDone = false;
  get logger() {
    return this.pipeline.logger;
  }
  get adapterLogger() {
    const currentOptions = this.logger.options;
    if (!this.#adapterLogger || this.#adapterLogger.options !== currentOptions) {
      this.#adapterLogger = new AstroIntegrationLogger(currentOptions, this.manifest.adapterName);
    }
    return this.#adapterLogger;
  }
  constructor(manifest2, streaming = true, ...args) {
    this.manifest = manifest2;
    this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest2.base);
    this.pipeline = this.createPipeline(streaming, manifest2, ...args);
    this.manifestData = this.pipeline.manifestData;
    this.#fetchHandler = new DefaultFetchHandler(this);
    this.#errorHandler = this.createErrorHandler();
  }
  /**
   * Override the fetch handler used to dispatch requests. Entrypoints
   * call this with the default export of `virtual:astro:fetchable` to
   * plug in a user-authored handler from `src/app.ts`.
   */
  setFetchHandler(handler) {
    this.#fetchHandler = handler;
    this.#hasCustomFetchHandler = !(handler instanceof DefaultFetchHandler);
  }
  /**
   * Returns the error handler strategy used by this app. Override to
   * provide environment-specific behavior (dev overlay, build-time throws, etc.).
   */
  createErrorHandler() {
    return new DefaultErrorHandler(this);
  }
  /**
   * Resets the cached adapter logger so it picks up a new logger instance.
   * Used by BuildApp when the logger is replaced via setOptions().
   */
  resetAdapterLogger() {
    this.#adapterLogger = void 0;
  }
  getAllowedDomains() {
    return this.manifest.allowedDomains;
  }
  matchesAllowedDomains(forwardedHost, protocol) {
    return BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
  }
  static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
    if (!allowedDomains || allowedDomains.length === 0) {
      return false;
    }
    try {
      const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
      return allowedDomains.some((pattern) => {
        return matchPattern(testUrl, pattern);
      });
    } catch {
      return false;
    }
  }
  set setManifestData(newManifestData) {
    this.manifestData = newManifestData;
    this.pipeline.manifestData = newManifestData;
    this.pipeline.rebuildRouter();
  }
  removeBase(pathname) {
    pathname = collapseDuplicateLeadingSlashes(pathname);
    if (pathname.startsWith(this.manifest.base)) {
      return pathname.slice(this.baseWithoutTrailingSlash.length + 1);
    }
    return pathname;
  }
  /**
   * Decodes a pathname with `decodeURI`, falling back to the raw pathname when it
   * contains an invalid percent-sequence (e.g. `%C0%AF`, an overlong-UTF-8 encoding of
   * `/` commonly sent by path-traversal scanners). A raw `decodeURI()` would throw
   * `URIError: URI malformed`, and because `match()` runs before `render()` that error
   * escapes the adapter's request handler as an uncaught exception (HTTP 500) that user
   * middleware can't catch.
   */
  safeDecodeURI(pathname) {
    try {
      return decodeURI(pathname);
    } catch (e) {
      this.adapterLogger.debug(e.toString());
      return pathname;
    }
  }
  /**
   * Extracts the base-stripped, decoded pathname from a request.
   * Used by adapters to compute the pathname for dev-mode route matching.
   */
  getPathnameFromRequest(request) {
    const url = new URL(request.url);
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    return this.safeDecodeURI(pathname);
  }
  /**
   * Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
   * routes aren't returned, even if they are matched.
   *
   * When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
   * @param request
   * @param allowPrerenderedRoutes
   */
  match(request, allowPrerenderedRoutes = false) {
    const url = new URL(request.url);
    if (this.manifest.assets.has(url.pathname)) return void 0;
    let pathname = this.computePathnameFromDomain(request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    const routeData = this.pipeline.matchRoute(this.safeDecodeURI(pathname));
    if (!routeData) return void 0;
    if (allowPrerenderedRoutes) {
      return routeData;
    }
    if (routeData.prerender) {
      if (routeData.params.length > 0) {
        const allMatches = this.pipeline.matchAllRoutes(this.safeDecodeURI(pathname));
        return allMatches.find((r) => !r.prerender);
      }
      return void 0;
    }
    return routeData;
  }
  /**
   * A matching route function to use in the development server.
   * Contrary to the `.match` function, this function resolves props and params, returning the correct
   * route based on the priority, segments. It also returns the correct, resolved pathname.
   * @param pathname
   */
  devMatch(pathname) {
    return void 0;
  }
  computePathnameFromDomain(request) {
    return computePathnameFromDomain(
      request,
      new URL(request.url),
      this.manifest.i18n,
      this.manifest.base,
      this.manifest.trailingSlash,
      this.logger
    );
  }
  async render(request, {
    addCookieHeader = false,
    clientAddress = Reflect.get(request, clientAddressSymbol),
    locals,
    prerenderedErrorPageFetch = fetch,
    routeData,
    waitUntil
  } = {}) {
    await this.pipeline.getLogger();
    if (routeData) {
      this.logger.debug(
        "router",
        "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ",
        request.url
      );
      this.logger.debug("router", "RouteData");
      this.logger.debug("router", routeData);
    }
    if (locals) {
      if (typeof locals !== "object") {
        const error2 = new AstroError(LocalsNotAnObject);
        this.logger.error(null, error2.stack);
        return this.renderError(request, {
          addCookieHeader,
          clientAddress,
          prerenderedErrorPageFetch,
          // If locals are invalid, we don't want to include them when
          // rendering the error page
          locals: void 0,
          routeData,
          waitUntil,
          status: 500,
          error: error2
        });
      }
    }
    if (!routeData) {
      const domainPathname = this.computePathnameFromDomain(request);
      if (domainPathname) {
        routeData = this.pipeline.matchRoute(this.safeDecodeURI(domainPathname));
      }
    }
    const resolvedOptions = {
      addCookieHeader,
      clientAddress,
      prerenderedErrorPageFetch,
      locals,
      routeData,
      waitUntil
    };
    let response;
    if (this.#fetchHandler instanceof DefaultFetchHandler) {
      Reflect.set(request, appSymbol, this);
      response = await this.#fetchHandler.renderWithOptions(request, resolvedOptions);
    } else {
      setRenderOptions(request, resolvedOptions);
      Reflect.set(request, appSymbol, this);
      response = await this.#fetchHandler.fetch(request);
    }
    this.#warnMissingFeatures();
    if (response.headers.get(ASTRO_ERROR_HEADER)) {
      response.headers.delete(ASTRO_ERROR_HEADER);
      return this.renderError(request, {
        addCookieHeader,
        clientAddress,
        prerenderedErrorPageFetch,
        locals,
        routeData,
        waitUntil,
        response,
        status: response.status,
        error: response.status === 500 ? null : void 0
      });
    }
    return response;
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
  /**
   * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
   * For example,
   * ```ts
   * for (const cookie_ of App.getSetCookieFromResponse(response)) {
   *     const cookie: string = cookie_
   * }
   * ```
   * @param response The response to read cookies from.
   * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
   */
  static getSetCookieFromResponse = getSetCookiesFromResponse;
  /**
   * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
   * This also handles pre-rendered /404 or /500 routes.
   *
   * Delegates to the app's configured `ErrorHandler`. To customize behavior
   * for a specific environment, override `createErrorHandler()` rather than
   * this method.
   */
  async renderError(request, options) {
    return this.#errorHandler.renderError(request, options);
  }
  /**
   * One-shot check: after the first request with a custom `src/app.ts`,
   * compare `usedFeatures` against the manifest and warn about any
   * configured features the user's pipeline doesn't call.
   */
  #warnMissingFeatures() {
    if (this.#featureCheckDone || !this.#hasCustomFetchHandler) return;
    this.#featureCheckDone = true;
    const manifest2 = this.manifest;
    const missing = [];
    const used = this.pipeline.usedFeatures;
    if (manifest2.routes.some((r) => r.routeData.type === "redirect") && !(used & PipelineFeatures.redirects)) {
      missing.push("redirects");
    }
    if (manifest2.sessionConfig && !(used & PipelineFeatures.sessions)) {
      missing.push("sessions");
    }
    if (manifest2.actions && !(used & PipelineFeatures.actions)) {
      missing.push("actions");
    }
    if (manifest2.middleware && !(used & PipelineFeatures.middleware)) {
      missing.push("middleware");
    }
    if (manifest2.i18n && manifest2.i18n.strategy !== "manual" && !(used & PipelineFeatures.i18n)) {
      missing.push("i18n");
    }
    if (manifest2.cacheConfig && !(used & PipelineFeatures.cache)) {
      missing.push("cache");
    }
    for (const feature of missing) {
      this.logger.warn(
        "router",
        `Your project uses ${feature}, but your custom src/app.ts does not call the ${feature}() handler. This feature will not work unless you add it to your app.ts pipeline.`
      );
    }
  }
  getDefaultStatusCode(routeData, pathname) {
    if (!routeData.pattern.test(pathname)) {
      for (const fallbackRoute of routeData.fallbackRoutes) {
        if (fallbackRoute.pattern.test(pathname)) {
          return 302;
        }
      }
    }
    const route = removeTrailingForwardSlash(routeData.route);
    if (route.endsWith("/404")) return 404;
    if (route.endsWith("/500")) return 500;
    return 200;
  }
  getManifest() {
    return this.pipeline.manifest;
  }
  logThisRequest({
    pathname,
    method,
    statusCode,
    isRewrite,
    timeStart
  }) {
    const timeEnd = performance.now();
    this.logRequest({
      pathname,
      method,
      statusCode,
      isRewrite,
      reqTime: timeEnd - timeStart
    });
  }
}
function getAssetsPrefix(fileExtension2, assetsPrefix) {
  let prefix = "";
  if (!assetsPrefix) {
    prefix = "";
  } else if (typeof assetsPrefix === "string") {
    prefix = assetsPrefix;
  } else {
    const dotLessFileExtension = fileExtension2.slice(1);
    prefix = assetsPrefix[dotLessFileExtension] || assetsPrefix.fallback;
  }
  return prefix;
}
const URL_PARSE_BASE = "https://astro.build";
function splitAssetPath(path) {
  const parsed = new URL(path, URL_PARSE_BASE);
  const isAbsolute = URL.canParse(path);
  const pathname = !isAbsolute && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
  return {
    pathname,
    suffix: `${parsed.search}${parsed.hash}`
  };
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
  const { pathname, suffix } = splitAssetPath(href);
  let url = "";
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(pathname), assetsPrefix);
    url = joinPaths(pf, slash(pathname)) + suffix;
  } else if (base) {
    url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
  } else {
    url = href;
  }
  return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
  return new Set(
    stylesheets.map((s2) => createStylesheetElement(s2, base, assetsPrefix))
  );
}
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}
class AppPipeline extends Pipeline {
  getName() {
    return "AppPipeline";
  }
  static create({ manifest: manifest2, streaming }) {
    const resolve = async function resolve2(specifier) {
      if (!(specifier in manifest2.entryModules)) {
        throw new Error(`Unable to resolve [${specifier}]`);
      }
      const bundlePath = manifest2.entryModules[specifier];
      if (bundlePath.startsWith("data:") || bundlePath.length === 0) {
        return bundlePath;
      } else {
        return createAssetLink(bundlePath, manifest2.base, manifest2.assetsPrefix);
      }
    };
    const logger = createConsoleLogger({ level: manifest2.logLevel });
    const pipeline = new AppPipeline(
      logger,
      manifest2,
      "production",
      manifest2.renderers,
      resolve,
      streaming,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0
    );
    return pipeline;
  }
  async headElements(routeData) {
    const { assetsPrefix, base } = this.manifest;
    const routeInfo = this.manifest.routes.find(
      (route) => route.routeData.route === routeData.route
    );
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? [], base, assetsPrefix);
    for (const script of routeInfo?.scripts ?? []) {
      if ("stage" in script) {
        if (script.stage === "head-inline") {
          scripts.add({
            props: {},
            children: script.children
          });
        }
      } else {
        scripts.add(createModuleScriptElement(script, base, assetsPrefix));
      }
    }
    return { links, styles, scripts };
  }
  componentMetadata() {
  }
  async getComponentByRoute(routeData) {
    const module = await this.getModuleForRoute(routeData);
    return module.page();
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance)
        };
      }
    }
    let routeToProcess = route;
    if (routeIsRedirect(route)) {
      if (route.redirectRoute) {
        routeToProcess = route.redirectRoute;
      } else {
        return RedirectSinglePageBuiltModule;
      }
    } else if (routeIsFallback(route)) {
      routeToProcess = getFallbackRoute(route, this.manifest.routes);
    }
    if (this.manifest.pageMap) {
      const importComponentInstance = this.manifest.pageMap.get(routeToProcess.component);
      if (!importComponentInstance) {
        throw new Error(
          `Unexpectedly unable to find a component instance for route ${route.route}`
        );
      }
      return await importComponentInstance();
    } else if (this.manifest.pageModule) {
      return this.manifest.pageModule;
    }
    throw new Error(
      "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
    );
  }
  async tryRewrite(payload, request) {
    const { newUrl, pathname, routeData } = findRouteToRewrite({
      payload,
      request,
      routes: this.manifest?.routes.map((r) => r.routeData),
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat,
      base: this.manifest.base,
      outDir: this.manifest?.serverLike ? this.manifest.buildClientDir : this.manifest.outDir
    });
    const componentInstance = await this.getComponentByRoute(routeData);
    return { newUrl, pathname, componentInstance, routeData };
  }
}
class App extends BaseApp {
  createPipeline(streaming) {
    return AppPipeline.create({
      manifest: this.manifest,
      streaming
    });
  }
  isDev() {
    return false;
  }
  // Should we log something for our users?
  logRequest(_options) {
  }
}
const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function") return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
    throwEnhancedErrorIfMdxComponent(e, Component);
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  try {
    const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
    return { html };
  } catch (e) {
    throwEnhancedErrorIfMdxComponent(e, Component);
    throw e;
  }
}
function throwEnhancedErrorIfMdxComponent(error2, Component) {
  if (Component[/* @__PURE__ */ Symbol.for("mdx-component")]) {
    if (AstroUserError.is(error2)) return;
    error2.title = error2.name;
    error2.hint = `This issue often occurs when your MDX component encounters runtime errors.`;
    throw error2;
  }
}
const renderer = {
  name: "astro:jsx",
  check,
  renderToStaticMarkup
};
var server_default$1 = renderer;
const renderers = [Object.assign({ "name": "astro:jsx", "serverEntrypoint": "file:///C:/dentalempireos/node_modules/@astrojs/mdx/dist/server.js" }, { ssr: server_default$1 })];
const serializedData = [{ "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "page", "component": "_server-islands.astro", "params": ["name"], "segments": [[{ "content": "_server-islands", "dynamic": false, "spread": false }], [{ "content": "name", "dynamic": true, "spread": false }]], "pattern": "^\\/_server-islands\\/([^/]+?)\\/?$", "prerender": false, "isIndex": false, "fallbackRoutes": [], "route": "/_server-islands/[name]", "origin": "internal", "distURL": [], "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/_image", "component": "node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint.js", "params": [], "pathname": "/_image", "pattern": "^\\/_image\\/?$", "segments": [[{ "content": "_image", "dynamic": false, "spread": false }]], "type": "endpoint", "prerender": false, "fallbackRoutes": [], "distURL": [], "isIndex": false, "origin": "internal", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/about", "isIndex": false, "type": "page", "pattern": "^\\/about\\/?$", "segments": [[{ "content": "about", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/about.astro", "pathname": "/about", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/account/clinic", "isIndex": false, "type": "page", "pattern": "^\\/account\\/clinic\\/?$", "segments": [[{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "clinic", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/account/clinic.astro", "pathname": "/account/clinic", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/account/profile", "isIndex": false, "type": "page", "pattern": "^\\/account\\/profile\\/?$", "segments": [[{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "profile", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/account/profile.astro", "pathname": "/account/profile", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/account/scanner-history", "isIndex": false, "type": "page", "pattern": "^\\/account\\/scanner-history\\/?$", "segments": [[{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "scanner-history", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/account/scanner-history.astro", "pathname": "/account/scanner-history", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/account/subscriptions", "isIndex": false, "type": "page", "pattern": "^\\/account\\/subscriptions\\/?$", "segments": [[{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "subscriptions", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/account/subscriptions.astro", "pathname": "/account/subscriptions", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/ai-settings", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/ai-settings\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "ai-settings", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/ai-settings.astro", "pathname": "/admin/ai-settings", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/apps/wizard", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/apps\\/wizard\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "apps", "dynamic": false, "spread": false }], [{ "content": "wizard", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/apps/wizard.astro", "pathname": "/admin/apps/wizard", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/apps/[id]", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/apps\\/([^/]+?)\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "apps", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/admin/apps/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/apps", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/apps\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "apps", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/apps/index.astro", "pathname": "/admin/apps", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/blog/categories", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/blog\\/categories\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "categories", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/blog/categories.astro", "pathname": "/admin/blog/categories", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/blog/new", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/blog\\/new\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "new", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/blog/new.astro", "pathname": "/admin/blog/new", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/blog/tags", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/blog\\/tags\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "tags", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/blog/tags.astro", "pathname": "/admin/blog/tags", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/blog/[id]", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/blog\\/([^/]+?)\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/admin/blog/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/blog", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/blog\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/blog/index.astro", "pathname": "/admin/blog", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/courses/[id]", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/courses\\/([^/]+?)\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "courses", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/admin/courses/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/courses", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/courses\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "courses", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/courses/index.astro", "pathname": "/admin/courses", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/ebooks/new", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/ebooks\\/new\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "ebooks", "dynamic": false, "spread": false }], [{ "content": "new", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/ebooks/new.astro", "pathname": "/admin/ebooks/new", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/ebooks/[id]", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/ebooks\\/([^/]+?)\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "ebooks", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/admin/ebooks/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/ebooks", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/ebooks\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "ebooks", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/ebooks/index.astro", "pathname": "/admin/ebooks", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/homepage", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/homepage\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "homepage", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/homepage.astro", "pathname": "/admin/homepage", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/orders", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/orders\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "orders", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/orders/index.astro", "pathname": "/admin/orders", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/products", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/products\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "products", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/products/index.astro", "pathname": "/admin/products", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/questions/[id]", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/questions\\/([^/]+?)\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "questions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/admin/questions/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/questions", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/questions\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "questions", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/questions/index.astro", "pathname": "/admin/questions", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/resources", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/resources\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "resources", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/resources/index.astro", "pathname": "/admin/resources", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/scanners/ho-so-goc-re/edit", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/scanners\\/ho-so-goc-re\\/edit\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanners", "dynamic": false, "spread": false }], [{ "content": "ho-so-goc-re", "dynamic": false, "spread": false }], [{ "content": "edit", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/scanners/ho-so-goc-re/edit.astro", "pathname": "/admin/scanners/ho-so-goc-re/edit", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/scanners/ho-so-goc-re", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/scanners\\/ho-so-goc-re\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanners", "dynamic": false, "spread": false }], [{ "content": "ho-so-goc-re", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/scanners/ho-so-goc-re.astro", "pathname": "/admin/scanners/ho-so-goc-re", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/scanners/[id]/response/[id]", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/scanners\\/([^/]+?)\\/response\\/([^/]+?)\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanners", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "response", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id", "id"], "component": "src/pages/admin/scanners/[id]/response/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/scanners/[id]/responses", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/scanners\\/([^/]+?)\\/responses\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanners", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "responses", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/admin/scanners/[id]/responses.astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/scanners/[id]", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/scanners\\/([^/]+?)\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanners", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/admin/scanners/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/scanners", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/scanners\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanners", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/scanners/index.astro", "pathname": "/admin/scanners", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/settings/payos", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/settings\\/payos\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "settings", "dynamic": false, "spread": false }], [{ "content": "payos", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/settings/payos.astro", "pathname": "/admin/settings/payos", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/settings/support", "isIndex": false, "type": "page", "pattern": "^\\/admin\\/settings\\/support\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "settings", "dynamic": false, "spread": false }], [{ "content": "support", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/settings/support.astro", "pathname": "/admin/settings/support", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin/users", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/users\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "users", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/users/index.astro", "pathname": "/admin/users", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/admin", "isIndex": true, "type": "page", "pattern": "^\\/admin\\/?$", "segments": [[{ "content": "admin", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/admin/index.astro", "pathname": "/admin", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/ai-mentor/[slug]", "isIndex": false, "type": "page", "pattern": "^\\/ai-mentor\\/([^/]+?)\\/?$", "segments": [[{ "content": "ai-mentor", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }]], "params": ["slug"], "component": "src/pages/ai-mentor/[slug].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/ai-tools", "isIndex": false, "type": "page", "pattern": "^\\/ai-tools\\/?$", "segments": [[{ "content": "ai-tools", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/ai-tools.astro", "pathname": "/ai-tools", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/account/avatar", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/account\\/avatar\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "avatar", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/account/avatar.ts", "pathname": "/api/account/avatar", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/account/clinic-profile", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/account\\/clinic-profile\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "clinic-profile", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/account/clinic-profile.ts", "pathname": "/api/account/clinic-profile", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/account/logo-upload", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/account\\/logo-upload\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "logo-upload", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/account/logo-upload.ts", "pathname": "/api/account/logo-upload", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/account/scanner-access", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/account\\/scanner-access\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "account", "dynamic": false, "spread": false }], [{ "content": "scanner-access", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/account/scanner-access.ts", "pathname": "/api/account/scanner-access", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/ai-providers", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/ai-providers\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "ai-providers", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/ai-providers.ts", "pathname": "/api/admin/ai-providers", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/ai-settings", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/ai-settings\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "ai-settings", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/ai-settings.ts", "pathname": "/api/admin/ai-settings", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/apps/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/apps\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "apps", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/apps/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/apps", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/apps\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "apps", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/apps/index.ts", "pathname": "/api/admin/apps", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/beautify", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/beautify\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "beautify", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/beautify.ts", "pathname": "/api/admin/beautify", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blocks/reorder", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blocks\\/reorder\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blocks", "dynamic": false, "spread": false }], [{ "content": "reorder", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/blocks/reorder.ts", "pathname": "/api/admin/blocks/reorder", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blocks/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blocks\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blocks", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/blocks/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blocks", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blocks\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blocks", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/blocks/index.ts", "pathname": "/api/admin/blocks", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blog/blocks/reorder", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blog\\/blocks\\/reorder\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "blocks", "dynamic": false, "spread": false }], [{ "content": "reorder", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/blog/blocks/reorder.ts", "pathname": "/api/admin/blog/blocks/reorder", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blog/blocks/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blog\\/blocks\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "blocks", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/blog/blocks/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blog/blocks", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blog\\/blocks\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "blocks", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/blog/blocks/index.ts", "pathname": "/api/admin/blog/blocks", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blog/categories/reorder", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blog\\/categories\\/reorder\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "categories", "dynamic": false, "spread": false }], [{ "content": "reorder", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/blog/categories/reorder.ts", "pathname": "/api/admin/blog/categories/reorder", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blog/tags", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blog\\/tags\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "tags", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/blog/tags.ts", "pathname": "/api/admin/blog/tags", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blog/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blog\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/blog/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/blog", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/blog\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "blog", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/blog/index.ts", "pathname": "/api/admin/blog", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/chapters/reorder", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/chapters\\/reorder\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "chapters", "dynamic": false, "spread": false }], [{ "content": "reorder", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/chapters/reorder.ts", "pathname": "/api/admin/chapters/reorder", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/chapters/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/chapters\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "chapters", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/chapters/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/chapters", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/chapters\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "chapters", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/chapters.ts", "pathname": "/api/admin/chapters", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/courses/videos/[videoId]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/courses\\/videos\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "courses", "dynamic": false, "spread": false }], [{ "content": "videos", "dynamic": false, "spread": false }], [{ "content": "videoId", "dynamic": true, "spread": false }]], "params": ["videoId"], "component": "src/pages/api/admin/courses/videos/[videoId].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/courses/[id]/videos", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/courses\\/([^/]+?)\\/videos\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "courses", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "videos", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/courses/[id]/videos.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/courses/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/courses\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "courses", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/courses/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/courses", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/courses\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "courses", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/courses/index.ts", "pathname": "/api/admin/courses", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/homepage-settings", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/homepage-settings\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "homepage-settings", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/homepage-settings.ts", "pathname": "/api/admin/homepage-settings", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/orders", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/orders\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "orders", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/orders/index.ts", "pathname": "/api/admin/orders", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/payos-settings", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/payos-settings\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "payos-settings", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/payos-settings.ts", "pathname": "/api/admin/payos-settings", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/products/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/products\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "products", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/products/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/products", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/products\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "products", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/products/index.ts", "pathname": "/api/admin/products", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/publish", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/publish\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "publish", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/publish.ts", "pathname": "/api/admin/publish", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/questions/[id]/reply", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/questions\\/([^/]+?)\\/reply\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "questions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "reply", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/questions/[id]/reply.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/questions/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/questions\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "questions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/questions/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/questions", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/questions\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "questions", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/questions.ts", "pathname": "/api/admin/questions", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/resources/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/resources\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "resources", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/resources/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/resources", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/resources\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "resources", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/resources.ts", "pathname": "/api/admin/resources", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/scanner/regenerate-ai", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/scanner\\/regenerate-ai\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanner", "dynamic": false, "spread": false }], [{ "content": "regenerate-ai", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/scanner/regenerate-ai.ts", "pathname": "/api/admin/scanner/regenerate-ai", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/scanner-definitions/[id]/sections/[sid]/questions/[qid]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/scanner-definitions\\/([^/]+?)\\/sections\\/([^/]+?)\\/questions\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanner-definitions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "sections", "dynamic": false, "spread": false }], [{ "content": "sid", "dynamic": true, "spread": false }], [{ "content": "questions", "dynamic": false, "spread": false }], [{ "content": "qid", "dynamic": true, "spread": false }]], "params": ["id", "sid", "qid"], "component": "src/pages/api/admin/scanner-definitions/[id]/sections/[sid]/questions/[qid].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/scanner-definitions/[id]/sections/[sid]/questions", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/scanner-definitions\\/([^/]+?)\\/sections\\/([^/]+?)\\/questions\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanner-definitions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "sections", "dynamic": false, "spread": false }], [{ "content": "sid", "dynamic": true, "spread": false }], [{ "content": "questions", "dynamic": false, "spread": false }]], "params": ["id", "sid"], "component": "src/pages/api/admin/scanner-definitions/[id]/sections/[sid]/questions.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/scanner-definitions/[id]/sections/[sid]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/scanner-definitions\\/([^/]+?)\\/sections\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanner-definitions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "sections", "dynamic": false, "spread": false }], [{ "content": "sid", "dynamic": true, "spread": false }]], "params": ["id", "sid"], "component": "src/pages/api/admin/scanner-definitions/[id]/sections/[sid].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/scanner-definitions/[id]/sections", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/scanner-definitions\\/([^/]+?)\\/sections\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanner-definitions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "sections", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/scanner-definitions/[id]/sections.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/scanner-definitions/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/scanner-definitions\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanner-definitions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/scanner-definitions/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/scanner-definitions", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/scanner-definitions\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "scanner-definitions", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/scanner-definitions/index.ts", "pathname": "/api/admin/scanner-definitions", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/sections/reorder", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/sections\\/reorder\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "sections", "dynamic": false, "spread": false }], [{ "content": "reorder", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/sections/reorder.ts", "pathname": "/api/admin/sections/reorder", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/sections/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/sections\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "sections", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/sections/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/sections", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/sections\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "sections", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/sections.ts", "pathname": "/api/admin/sections", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/seed-all-new", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/seed-all-new\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "seed-all-new", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/seed-all-new.ts", "pathname": "/api/admin/seed-all-new", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/seed-free-scanners", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/seed-free-scanners\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "seed-free-scanners", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/seed-free-scanners.ts", "pathname": "/api/admin/seed-free-scanners", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/seed-ho-so-goc-re", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/seed-ho-so-goc-re\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "seed-ho-so-goc-re", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/seed-ho-so-goc-re.ts", "pathname": "/api/admin/seed-ho-so-goc-re", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/seed-quy-trinh-check", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/seed-quy-trinh-check\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "seed-quy-trinh-check", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/seed-quy-trinh-check.ts", "pathname": "/api/admin/seed-quy-trinh-check", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/seed-scanner/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/seed-scanner\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "seed-scanner", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/admin/seed-scanner/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/seed-tai-chinh-check", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/seed-tai-chinh-check\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "seed-tai-chinh-check", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/seed-tai-chinh-check.ts", "pathname": "/api/admin/seed-tai-chinh-check", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/seed-tiep-don-check", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/seed-tiep-don-check\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "seed-tiep-don-check", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/seed-tiep-don-check.ts", "pathname": "/api/admin/seed-tiep-don-check", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/support-settings", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/support-settings\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "support-settings", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/support-settings.ts", "pathname": "/api/admin/support-settings", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/upload", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/upload\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "upload", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/upload.ts", "pathname": "/api/admin/upload", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/users", "isIndex": true, "type": "endpoint", "pattern": "^\\/api\\/admin\\/users\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "users", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/users/index.ts", "pathname": "/api/admin/users", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/wizard/create", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/wizard\\/create\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "wizard", "dynamic": false, "spread": false }], [{ "content": "create", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/wizard/create.ts", "pathname": "/api/admin/wizard/create", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/admin/wizard/generate", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/admin\\/wizard\\/generate\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "admin", "dynamic": false, "spread": false }], [{ "content": "wizard", "dynamic": false, "spread": false }], [{ "content": "generate", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/admin/wizard/generate.ts", "pathname": "/api/admin/wizard/generate", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/ai-mentor/chat", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/ai-mentor\\/chat\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "ai-mentor", "dynamic": false, "spread": false }], [{ "content": "chat", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/ai-mentor/chat.ts", "pathname": "/api/ai-mentor/chat", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/app/[id]/chat", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/app\\/([^/]+?)\\/chat\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "app", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "chat", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/api/app/[id]/chat.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/app/[id]/run", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/app\\/([^/]+?)\\/run\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "app", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "run", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/api/app/[id]/run.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/[...all]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "...all", "dynamic": true, "spread": true }]], "params": ["...all"], "component": "src/pages/api/auth/[...all].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/blog-form", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/blog-form\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "blog-form", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/blog-form.ts", "pathname": "/api/blog-form", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/debug-db", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/debug-db\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "debug-db", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/debug-db.ts", "pathname": "/api/debug-db", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/newsletter", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/newsletter\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "newsletter", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/newsletter.ts", "pathname": "/api/newsletter", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/notifications/read", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/notifications\\/read\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "notifications", "dynamic": false, "spread": false }], [{ "content": "read", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/notifications/read.ts", "pathname": "/api/notifications/read", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/notifications/unread-count", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/notifications\\/unread-count\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "notifications", "dynamic": false, "spread": false }], [{ "content": "unread-count", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/notifications/unread-count.ts", "pathname": "/api/notifications/unread-count", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/notifications", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/notifications\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "notifications", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/notifications.ts", "pathname": "/api/notifications", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/og/chapter/[slug].svg", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/og\\/chapter\\/([^/]+?)\\.svg\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "og", "dynamic": false, "spread": false }], [{ "content": "chapter", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }, { "content": ".svg", "dynamic": false, "spread": false }]], "params": ["slug"], "component": "src/pages/api/og/chapter/[slug].svg.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/payos/cancel-payment", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/payos\\/cancel-payment\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "payos", "dynamic": false, "spread": false }], [{ "content": "cancel-payment", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/payos/cancel-payment.ts", "pathname": "/api/payos/cancel-payment", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/payos/check-access", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/payos\\/check-access\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "payos", "dynamic": false, "spread": false }], [{ "content": "check-access", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/payos/check-access.ts", "pathname": "/api/payos/check-access", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/payos/create-payment", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/payos\\/create-payment\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "payos", "dynamic": false, "spread": false }], [{ "content": "create-payment", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/payos/create-payment.ts", "pathname": "/api/payos/create-payment", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/payos/webhook", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/payos\\/webhook\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "payos", "dynamic": false, "spread": false }], [{ "content": "webhook", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/payos/webhook.ts", "pathname": "/api/payos/webhook", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/public/reviews/latest", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/public\\/reviews\\/latest\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "public", "dynamic": false, "spread": false }], [{ "content": "reviews", "dynamic": false, "spread": false }], [{ "content": "latest", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/public/reviews/latest.ts", "pathname": "/api/public/reviews/latest", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/public/reviews/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/public\\/reviews\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "public", "dynamic": false, "spread": false }], [{ "content": "reviews", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/public/reviews/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/public/reviews", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/public\\/reviews\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "public", "dynamic": false, "spread": false }], [{ "content": "reviews", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/public/reviews.ts", "pathname": "/api/public/reviews", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/public/support-settings", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/public\\/support-settings\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "public", "dynamic": false, "spread": false }], [{ "content": "support-settings", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/public/support-settings.ts", "pathname": "/api/public/support-settings", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/questions/[id]/reply", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/questions\\/([^/]+?)\\/reply\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "questions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "reply", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/api/questions/[id]/reply.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/questions/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/questions\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "questions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/questions/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/questions", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/questions\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "questions", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/questions.ts", "pathname": "/api/questions", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/reading-progress/unlock-check", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/reading-progress\\/unlock-check\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "reading-progress", "dynamic": false, "spread": false }], [{ "content": "unlock-check", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/reading-progress/unlock-check.ts", "pathname": "/api/reading-progress/unlock-check", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/reading-progress", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/reading-progress\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "reading-progress", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/reading-progress.ts", "pathname": "/api/reading-progress", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/scanner/check-access", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/scanner\\/check-access\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "scanner", "dynamic": false, "spread": false }], [{ "content": "check-access", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/scanner/check-access.ts", "pathname": "/api/scanner/check-access", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/scanner/run-ai", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/scanner\\/run-ai\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "scanner", "dynamic": false, "spread": false }], [{ "content": "run-ai", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/scanner/run-ai.ts", "pathname": "/api/scanner/run-ai", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/scanner/submit", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/scanner\\/submit\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "scanner", "dynamic": false, "spread": false }], [{ "content": "submit", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/scanner/submit.ts", "pathname": "/api/scanner/submit", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/scanner/[id]/pdf", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/scanner\\/([^/]+?)\\/pdf\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "scanner", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }], [{ "content": "pdf", "dynamic": false, "spread": false }]], "params": ["id"], "component": "src/pages/api/scanner/[id]/pdf.ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/scanner/[id]", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/scanner\\/([^/]+?)\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "scanner", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/api/scanner/[id].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/seeds/list", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/seeds\\/list\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "seeds", "dynamic": false, "spread": false }], [{ "content": "list", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/seeds/list.ts", "pathname": "/api/seeds/list", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/app/[slug]", "isIndex": false, "type": "page", "pattern": "^\\/app\\/([^/]+?)\\/?$", "segments": [[{ "content": "app", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }]], "params": ["slug"], "component": "src/pages/app/[slug].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/blog/category/[category]", "isIndex": true, "type": "page", "pattern": "^\\/blog\\/category\\/([^/]+?)\\/?$", "segments": [[{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "category", "dynamic": false, "spread": false }], [{ "content": "category", "dynamic": true, "spread": false }]], "params": ["category"], "component": "src/pages/blog/category/[category]/index.astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/blog/[slug]", "isIndex": false, "type": "page", "pattern": "^\\/blog\\/([^/]+?)\\/?$", "segments": [[{ "content": "blog", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }]], "params": ["slug"], "component": "src/pages/blog/[slug].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/blog", "isIndex": true, "type": "page", "pattern": "^\\/blog\\/?$", "segments": [[{ "content": "blog", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/blog/index.astro", "pathname": "/blog", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/book", "isIndex": true, "type": "page", "pattern": "^\\/book\\/?$", "segments": [[{ "content": "book", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/book/index.astro", "pathname": "/book", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/book/[...slug]", "isIndex": false, "type": "page", "pattern": "^\\/book(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "book", "dynamic": false, "spread": false }], [{ "content": "...slug", "dynamic": true, "spread": true }]], "params": ["...slug"], "component": "src/pages/book/[...slug].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/courses/[id]", "isIndex": false, "type": "page", "pattern": "^\\/courses\\/([^/]+?)\\/?$", "segments": [[{ "content": "courses", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/courses/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/courses", "isIndex": true, "type": "page", "pattern": "^\\/courses\\/?$", "segments": [[{ "content": "courses", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/courses/index.astro", "pathname": "/courses", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/login", "isIndex": false, "type": "page", "pattern": "^\\/login\\/?$", "segments": [[{ "content": "login", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/login.astro", "pathname": "/login", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/media/[...key]", "isIndex": false, "type": "endpoint", "pattern": "^\\/media(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "media", "dynamic": false, "spread": false }], [{ "content": "...key", "dynamic": true, "spread": true }]], "params": ["...key"], "component": "src/pages/media/[...key].ts", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/my-questions/[id]", "isIndex": false, "type": "page", "pattern": "^\\/my-questions\\/([^/]+?)\\/?$", "segments": [[{ "content": "my-questions", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/my-questions/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/my-questions", "isIndex": true, "type": "page", "pattern": "^\\/my-questions\\/?$", "segments": [[{ "content": "my-questions", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/my-questions/index.astro", "pathname": "/my-questions", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/payment/cancel", "isIndex": false, "type": "page", "pattern": "^\\/payment\\/cancel\\/?$", "segments": [[{ "content": "payment", "dynamic": false, "spread": false }], [{ "content": "cancel", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/payment/cancel.astro", "pathname": "/payment/cancel", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/payment/return", "isIndex": false, "type": "page", "pattern": "^\\/payment\\/return\\/?$", "segments": [[{ "content": "payment", "dynamic": false, "spread": false }], [{ "content": "return", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/payment/return.astro", "pathname": "/payment/return", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/register", "isIndex": false, "type": "page", "pattern": "^\\/register\\/?$", "segments": [[{ "content": "register", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/register.astro", "pathname": "/register", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/resources", "isIndex": true, "type": "page", "pattern": "^\\/resources\\/?$", "segments": [[{ "content": "resources", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/resources/index.astro", "pathname": "/resources", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/reviews", "isIndex": false, "type": "page", "pattern": "^\\/reviews\\/?$", "segments": [[{ "content": "reviews", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/reviews.astro", "pathname": "/reviews", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/rss.xml", "isIndex": false, "type": "endpoint", "pattern": "^\\/rss\\.xml$", "segments": [[{ "content": "rss.xml", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/rss.xml.ts", "pathname": "/rss.xml", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/scanner/pack", "isIndex": false, "type": "page", "pattern": "^\\/scanner\\/pack\\/?$", "segments": [[{ "content": "scanner", "dynamic": false, "spread": false }], [{ "content": "pack", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/scanner/pack.astro", "pathname": "/scanner/pack", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/scanner/result/[id]", "isIndex": false, "type": "page", "pattern": "^\\/scanner\\/result\\/([^/]+?)\\/?$", "segments": [[{ "content": "scanner", "dynamic": false, "spread": false }], [{ "content": "result", "dynamic": false, "spread": false }], [{ "content": "id", "dynamic": true, "spread": false }]], "params": ["id"], "component": "src/pages/scanner/result/[id].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/scanner/test", "isIndex": false, "type": "page", "pattern": "^\\/scanner\\/test\\/?$", "segments": [[{ "content": "scanner", "dynamic": false, "spread": false }], [{ "content": "test", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/scanner/test.astro", "pathname": "/scanner/test", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/scanner/[slug]", "isIndex": false, "type": "page", "pattern": "^\\/scanner\\/([^/]+?)\\/?$", "segments": [[{ "content": "scanner", "dynamic": false, "spread": false }], [{ "content": "slug", "dynamic": true, "spread": false }]], "params": ["slug"], "component": "src/pages/scanner/[slug].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/scanner", "isIndex": true, "type": "page", "pattern": "^\\/scanner\\/?$", "segments": [[{ "content": "scanner", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/scanner/index.astro", "pathname": "/scanner", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/search", "isIndex": false, "type": "page", "pattern": "^\\/search\\/?$", "segments": [[{ "content": "search", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/search.astro", "pathname": "/search", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/verify-email", "isIndex": false, "type": "page", "pattern": "^\\/verify-email\\/?$", "segments": [[{ "content": "verify-email", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/verify-email.astro", "pathname": "/verify-email", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/videos", "isIndex": true, "type": "page", "pattern": "^\\/videos\\/?$", "segments": [[{ "content": "videos", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/videos/index.astro", "pathname": "/videos", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/", "isIndex": true, "type": "page", "pattern": "^\\/$", "segments": [], "params": [], "component": "src/pages/index.astro", "pathname": "/", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }];
serializedData.map(deserializeRouteInfo);
const _page0 = () => import("./image-transform-endpoint_DSjPvYr8.mjs").then((n) => n.i);
const _page1 = () => import("./about_DzTLwK4N.mjs");
const _page2 = () => import("./clinic_C7wkm_q6.mjs");
const _page3 = () => import("./profile_CJ-HI0Tr.mjs");
const _page4 = () => import("./scanner-history_DuQf_EPA.mjs");
const _page5 = () => import("./subscriptions_BY8jvwbR.mjs");
const _page6 = () => import("./ai-settings_DbtAJ_VF.mjs");
const _page7 = () => import("./wizard_BzQ_UIXH.mjs");
const _page8 = () => import("./_id__oTbaY74F.mjs");
const _page9 = () => import("./index_CfbLrjJV.mjs");
const _page10 = () => import("./categories_sd6apdTc.mjs");
const _page11 = () => import("./new_BjmqxZPr.mjs");
const _page12 = () => import("./tags_DP0ZJ9o_.mjs");
const _page13 = () => import("./_id__wj4DtmVu.mjs");
const _page14 = () => import("./index_BsLnBQ04.mjs");
const _page15 = () => import("./_id__Cqqnzumc.mjs");
const _page16 = () => import("./index_Dug4yN7q.mjs");
const _page17 = () => import("./new_Ch9KtQbh.mjs");
const _page18 = () => import("./_id__GjeFjDIO.mjs");
const _page19 = () => import("./index_CgbcoGO-.mjs");
const _page20 = () => import("./homepage_B9EJTLHd.mjs");
const _page21 = () => import("./index_B_nemo7z.mjs");
const _page22 = () => import("./index_CI2H6nIS.mjs");
const _page23 = () => import("./_id__C8mBqawO.mjs");
const _page24 = () => import("./index_Czawbm5G.mjs");
const _page25 = () => import("./index_Bf5zkshd.mjs");
const _page26 = () => import("./edit_CvHE3xtS.mjs");
const _page27 = () => import("./ho-so-goc-re_D9Y8i9HF.mjs");
const _page28 = () => import("./_id__D35tfHp3.mjs");
const _page29 = () => import("./responses_rs4EYwGC.mjs");
const _page30 = () => import("./_id__d6CmlEhq.mjs");
const _page31 = () => import("./index_Cd2Ot2EY.mjs");
const _page32 = () => import("./payos_wNoxf_PS.mjs");
const _page33 = () => import("./support_BA7toCIx.mjs");
const _page34 = () => import("./index_DxuooOFO.mjs");
const _page35 = () => import("./index_BaHb9ime.mjs");
const _page36 = () => import("./_slug__CGjccvbn.mjs");
const _page37 = () => import("./ai-tools_JIGO1sOx.mjs");
const _page38 = () => import("./avatar_BPYTN4RV.mjs");
const _page39 = () => import("./clinic-profile_BotpftHZ.mjs");
const _page40 = () => import("./logo-upload_DVUBCPcM.mjs");
const _page41 = () => import("./scanner-access_p2-qwh5L.mjs");
const _page42 = () => import("./ai-providers_C60vyQDO.mjs");
const _page43 = () => import("./ai-settings_CyQvvmSc.mjs");
const _page44 = () => import("./_id__Dmk_00Fz.mjs");
const _page45 = () => import("./index_B4UbSFOb.mjs");
const _page46 = () => import("./beautify_DDqw6o_e.mjs");
const _page47 = () => import("./reorder_BzwXBwek.mjs");
const _page48 = () => import("./_id__x4j764JF.mjs");
const _page49 = () => import("./index_5ByLo5sb.mjs");
const _page50 = () => import("./reorder_DozK0CS0.mjs");
const _page51 = () => import("./_id__BnRfhaYO.mjs");
const _page52 = () => import("./index_B3DpKU82.mjs");
const _page53 = () => import("./reorder_Beywf6G-.mjs");
const _page54 = () => import("./tags_Dl7JD0qO.mjs");
const _page55 = () => import("./_id__CeA7Qr_F.mjs");
const _page56 = () => import("./index_BuzMRAvM.mjs");
const _page57 = () => import("./reorder_UFMISrG3.mjs");
const _page58 = () => import("./_id__DAYnqL3E.mjs");
const _page59 = () => import("./chapters_B4Nc5drH.mjs");
const _page60 = () => import("./_videoId__Dh3cHNDa.mjs");
const _page61 = () => import("./videos_94ONevuv.mjs");
const _page62 = () => import("./_id__CxcJJ5B4.mjs");
const _page63 = () => import("./index_Ck5ab38i.mjs");
const _page64 = () => import("./homepage-settings_D_SdYktE.mjs");
const _page65 = () => import("./index_BB8G2l4B.mjs");
const _page66 = () => import("./payos-settings_CjtcXDct.mjs");
const _page67 = () => import("./_id__ByDIrt1P.mjs");
const _page68 = () => import("./index_DnFplHR1.mjs");
const _page69 = () => import("./publish_wDqqF9X8.mjs");
const _page70 = () => import("./reply_oc56BuYY.mjs");
const _page71 = () => import("./_id__Dx4rBCgW.mjs");
const _page72 = () => import("./questions_Bz9Wm0Fr.mjs");
const _page73 = () => import("./_id__DzD79NU9.mjs");
const _page74 = () => import("./resources_DoN32hEz.mjs");
const _page75 = () => import("./regenerate-ai_DP9b0tJk.mjs");
const _page76 = () => import("./_qid__BvNVcaBT.mjs");
const _page77 = () => import("./questions_DhuBdl87.mjs");
const _page78 = () => import("./_sid__CIDRWpZ2.mjs");
const _page79 = () => import("./sections_DxlAshTz.mjs");
const _page80 = () => import("./_id__qq0ErevS.mjs");
const _page81 = () => import("./index_Wzx30knb.mjs");
const _page82 = () => import("./reorder_BMss_88X.mjs");
const _page83 = () => import("./_id__CKqWUQ7Y.mjs");
const _page84 = () => import("./sections_pjoKu6TR.mjs");
const _page85 = () => import("./seed-all-new_SYDiyMnS.mjs");
const _page86 = () => import("./seed-free-scanners_CXOe3Gqj.mjs");
const _page87 = () => import("./seed-ho-so-goc-re_CESs0ADR.mjs");
const _page88 = () => import("./seed-quy-trinh-check_D1lcv4oU.mjs");
const _page89 = () => import("./_id__Bu2AqVsA.mjs");
const _page90 = () => import("./seed-tai-chinh-check_o8UFL6TK.mjs");
const _page91 = () => import("./seed-tiep-don-check_DReEFTUf.mjs");
const _page92 = () => import("./support-settings_CLxIrWvu.mjs");
const _page93 = () => import("./upload_CUt5sj7Z.mjs");
const _page94 = () => import("./index_BoqqtZ6H.mjs");
const _page95 = () => import("./create_nDRR915D.mjs");
const _page96 = () => import("./generate_Ngp_48_n.mjs");
const _page97 = () => import("./chat_mX9ni_ir.mjs");
const _page98 = () => import("./chat_CsjpTPSJ.mjs");
const _page99 = () => import("./run_Ch2gjCQw.mjs");
const _page100 = () => import("./_.._abphtoom.mjs");
const _page101 = () => import("./blog-form_DGJ39mc7.mjs");
const _page102 = () => import("./debug-db_ChI0yDcD.mjs");
const _page103 = () => import("./newsletter_GYZrm8Ev.mjs");
const _page104 = () => import("./read_BZPGr0f_.mjs");
const _page105 = () => import("./unread-count_CDudvLg7.mjs");
const _page106 = () => import("./notifications_BP5HammE.mjs");
const _page107 = () => import("./_slug__Bs6M5Kcg.mjs");
const _page108 = () => import("./cancel-payment_DLGmiCsw.mjs");
const _page109 = () => import("./check-access_cbzizGhA.mjs");
const _page110 = () => import("./create-payment_93OTR5YC.mjs");
const _page111 = () => import("./webhook_Dos0ipd4.mjs");
const _page112 = () => import("./latest_CH76gp5s.mjs");
const _page113 = () => import("./_id__B-BhIHXh.mjs");
const _page114 = () => import("./reviews_CNloZj6p.mjs");
const _page115 = () => import("./support-settings_CjangZV9.mjs");
const _page116 = () => import("./reply_COE5mpbb.mjs");
const _page117 = () => import("./_id__DbQ-DZdj.mjs");
const _page118 = () => import("./questions_C0tIvgon.mjs");
const _page119 = () => import("./unlock-check_Cet4QDFy.mjs");
const _page120 = () => import("./reading-progress_CLU06azF.mjs");
const _page121 = () => import("./check-access_DYplKxNN.mjs");
const _page122 = () => import("./run-ai_DLBdbyL4.mjs");
const _page123 = () => import("./submit_D_XhpkZT.mjs");
const _page124 = () => import("./pdf_BxXfFwgZ.mjs");
const _page125 = () => import("./_id__Bk2rN1nM.mjs");
const _page126 = () => import("./list_sHYUkP3n.mjs");
const _page127 = () => import("./_slug__CmFJb_NP.mjs");
const _page128 = () => import("./index_C56o7728.mjs");
const _page129 = () => import("./_slug__CHO1ChbC.mjs");
const _page130 = () => import("./index_CTtQ8KcF.mjs");
const _page131 = () => import("./index_ClXxVYI9.mjs");
const _page132 = () => import("./_.._DC_wlX1e.mjs");
const _page133 = () => import("./_id__Blw68nmq.mjs");
const _page134 = () => import("./index_C78-VoJo.mjs");
const _page135 = () => import("./login_BdIJpdKd.mjs");
const _page136 = () => import("./_.._C1Otdv7N.mjs");
const _page137 = () => import("./_id__CdQSUE96.mjs");
const _page138 = () => import("./index_DwaWeNUE.mjs");
const _page139 = () => import("./cancel_Bkiza3EL.mjs");
const _page140 = () => import("./return_BDEywhXs.mjs");
const _page141 = () => import("./register_jhJ2nzcD.mjs");
const _page142 = () => import("./index_BuXCBF-p.mjs");
const _page143 = () => import("./reviews_DDyLUWl6.mjs");
const _page144 = () => import("./rss_u-qqBgcH.mjs");
const _page145 = () => import("./pack_CjQdygxs.mjs");
const _page146 = () => import("./_id__BL4K-cq_.mjs");
const _page147 = () => import("./test_DfWFRFA3.mjs");
const _page148 = () => import("./_slug__BC__0u4m.mjs");
const _page149 = () => import("./index_flZG26T6.mjs");
const _page150 = () => import("./search_DD7Y2L_T.mjs");
const _page151 = () => import("./verify-email_CSwpy9lW.mjs");
const _page152 = () => import("./index_WlUpzUXM.mjs");
const _page153 = () => import("./index_nKgYD2C1.mjs");
const pageMap = /* @__PURE__ */ new Map([
  ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint.js", _page0],
  ["src/pages/about.astro", _page1],
  ["src/pages/account/clinic.astro", _page2],
  ["src/pages/account/profile.astro", _page3],
  ["src/pages/account/scanner-history.astro", _page4],
  ["src/pages/account/subscriptions.astro", _page5],
  ["src/pages/admin/ai-settings.astro", _page6],
  ["src/pages/admin/apps/wizard.astro", _page7],
  ["src/pages/admin/apps/[id].astro", _page8],
  ["src/pages/admin/apps/index.astro", _page9],
  ["src/pages/admin/blog/categories.astro", _page10],
  ["src/pages/admin/blog/new.astro", _page11],
  ["src/pages/admin/blog/tags.astro", _page12],
  ["src/pages/admin/blog/[id].astro", _page13],
  ["src/pages/admin/blog/index.astro", _page14],
  ["src/pages/admin/courses/[id].astro", _page15],
  ["src/pages/admin/courses/index.astro", _page16],
  ["src/pages/admin/ebooks/new.astro", _page17],
  ["src/pages/admin/ebooks/[id].astro", _page18],
  ["src/pages/admin/ebooks/index.astro", _page19],
  ["src/pages/admin/homepage.astro", _page20],
  ["src/pages/admin/orders/index.astro", _page21],
  ["src/pages/admin/products/index.astro", _page22],
  ["src/pages/admin/questions/[id].astro", _page23],
  ["src/pages/admin/questions/index.astro", _page24],
  ["src/pages/admin/resources/index.astro", _page25],
  ["src/pages/admin/scanners/ho-so-goc-re/edit.astro", _page26],
  ["src/pages/admin/scanners/ho-so-goc-re.astro", _page27],
  ["src/pages/admin/scanners/[id]/response/[id].astro", _page28],
  ["src/pages/admin/scanners/[id]/responses.astro", _page29],
  ["src/pages/admin/scanners/[id].astro", _page30],
  ["src/pages/admin/scanners/index.astro", _page31],
  ["src/pages/admin/settings/payos.astro", _page32],
  ["src/pages/admin/settings/support.astro", _page33],
  ["src/pages/admin/users/index.astro", _page34],
  ["src/pages/admin/index.astro", _page35],
  ["src/pages/ai-mentor/[slug].astro", _page36],
  ["src/pages/ai-tools.astro", _page37],
  ["src/pages/api/account/avatar.ts", _page38],
  ["src/pages/api/account/clinic-profile.ts", _page39],
  ["src/pages/api/account/logo-upload.ts", _page40],
  ["src/pages/api/account/scanner-access.ts", _page41],
  ["src/pages/api/admin/ai-providers.ts", _page42],
  ["src/pages/api/admin/ai-settings.ts", _page43],
  ["src/pages/api/admin/apps/[id].ts", _page44],
  ["src/pages/api/admin/apps/index.ts", _page45],
  ["src/pages/api/admin/beautify.ts", _page46],
  ["src/pages/api/admin/blocks/reorder.ts", _page47],
  ["src/pages/api/admin/blocks/[id].ts", _page48],
  ["src/pages/api/admin/blocks/index.ts", _page49],
  ["src/pages/api/admin/blog/blocks/reorder.ts", _page50],
  ["src/pages/api/admin/blog/blocks/[id].ts", _page51],
  ["src/pages/api/admin/blog/blocks/index.ts", _page52],
  ["src/pages/api/admin/blog/categories/reorder.ts", _page53],
  ["src/pages/api/admin/blog/tags.ts", _page54],
  ["src/pages/api/admin/blog/[id].ts", _page55],
  ["src/pages/api/admin/blog/index.ts", _page56],
  ["src/pages/api/admin/chapters/reorder.ts", _page57],
  ["src/pages/api/admin/chapters/[id].ts", _page58],
  ["src/pages/api/admin/chapters.ts", _page59],
  ["src/pages/api/admin/courses/videos/[videoId].ts", _page60],
  ["src/pages/api/admin/courses/[id]/videos.ts", _page61],
  ["src/pages/api/admin/courses/[id].ts", _page62],
  ["src/pages/api/admin/courses/index.ts", _page63],
  ["src/pages/api/admin/homepage-settings.ts", _page64],
  ["src/pages/api/admin/orders/index.ts", _page65],
  ["src/pages/api/admin/payos-settings.ts", _page66],
  ["src/pages/api/admin/products/[id].ts", _page67],
  ["src/pages/api/admin/products/index.ts", _page68],
  ["src/pages/api/admin/publish.ts", _page69],
  ["src/pages/api/admin/questions/[id]/reply.ts", _page70],
  ["src/pages/api/admin/questions/[id].ts", _page71],
  ["src/pages/api/admin/questions.ts", _page72],
  ["src/pages/api/admin/resources/[id].ts", _page73],
  ["src/pages/api/admin/resources.ts", _page74],
  ["src/pages/api/admin/scanner/regenerate-ai.ts", _page75],
  ["src/pages/api/admin/scanner-definitions/[id]/sections/[sid]/questions/[qid].ts", _page76],
  ["src/pages/api/admin/scanner-definitions/[id]/sections/[sid]/questions.ts", _page77],
  ["src/pages/api/admin/scanner-definitions/[id]/sections/[sid].ts", _page78],
  ["src/pages/api/admin/scanner-definitions/[id]/sections.ts", _page79],
  ["src/pages/api/admin/scanner-definitions/[id].ts", _page80],
  ["src/pages/api/admin/scanner-definitions/index.ts", _page81],
  ["src/pages/api/admin/sections/reorder.ts", _page82],
  ["src/pages/api/admin/sections/[id].ts", _page83],
  ["src/pages/api/admin/sections.ts", _page84],
  ["src/pages/api/admin/seed-all-new.ts", _page85],
  ["src/pages/api/admin/seed-free-scanners.ts", _page86],
  ["src/pages/api/admin/seed-ho-so-goc-re.ts", _page87],
  ["src/pages/api/admin/seed-quy-trinh-check.ts", _page88],
  ["src/pages/api/admin/seed-scanner/[id].ts", _page89],
  ["src/pages/api/admin/seed-tai-chinh-check.ts", _page90],
  ["src/pages/api/admin/seed-tiep-don-check.ts", _page91],
  ["src/pages/api/admin/support-settings.ts", _page92],
  ["src/pages/api/admin/upload.ts", _page93],
  ["src/pages/api/admin/users/index.ts", _page94],
  ["src/pages/api/admin/wizard/create.ts", _page95],
  ["src/pages/api/admin/wizard/generate.ts", _page96],
  ["src/pages/api/ai-mentor/chat.ts", _page97],
  ["src/pages/api/app/[id]/chat.ts", _page98],
  ["src/pages/api/app/[id]/run.ts", _page99],
  ["src/pages/api/auth/[...all].ts", _page100],
  ["src/pages/api/blog-form.ts", _page101],
  ["src/pages/api/debug-db.ts", _page102],
  ["src/pages/api/newsletter.ts", _page103],
  ["src/pages/api/notifications/read.ts", _page104],
  ["src/pages/api/notifications/unread-count.ts", _page105],
  ["src/pages/api/notifications.ts", _page106],
  ["src/pages/api/og/chapter/[slug].svg.ts", _page107],
  ["src/pages/api/payos/cancel-payment.ts", _page108],
  ["src/pages/api/payos/check-access.ts", _page109],
  ["src/pages/api/payos/create-payment.ts", _page110],
  ["src/pages/api/payos/webhook.ts", _page111],
  ["src/pages/api/public/reviews/latest.ts", _page112],
  ["src/pages/api/public/reviews/[id].ts", _page113],
  ["src/pages/api/public/reviews.ts", _page114],
  ["src/pages/api/public/support-settings.ts", _page115],
  ["src/pages/api/questions/[id]/reply.ts", _page116],
  ["src/pages/api/questions/[id].ts", _page117],
  ["src/pages/api/questions.ts", _page118],
  ["src/pages/api/reading-progress/unlock-check.ts", _page119],
  ["src/pages/api/reading-progress.ts", _page120],
  ["src/pages/api/scanner/check-access.ts", _page121],
  ["src/pages/api/scanner/run-ai.ts", _page122],
  ["src/pages/api/scanner/submit.ts", _page123],
  ["src/pages/api/scanner/[id]/pdf.ts", _page124],
  ["src/pages/api/scanner/[id].ts", _page125],
  ["src/pages/api/seeds/list.ts", _page126],
  ["src/pages/app/[slug].astro", _page127],
  ["src/pages/blog/category/[category]/index.astro", _page128],
  ["src/pages/blog/[slug].astro", _page129],
  ["src/pages/blog/index.astro", _page130],
  ["src/pages/book/index.astro", _page131],
  ["src/pages/book/[...slug].astro", _page132],
  ["src/pages/courses/[id].astro", _page133],
  ["src/pages/courses/index.astro", _page134],
  ["src/pages/login.astro", _page135],
  ["src/pages/media/[...key].ts", _page136],
  ["src/pages/my-questions/[id].astro", _page137],
  ["src/pages/my-questions/index.astro", _page138],
  ["src/pages/payment/cancel.astro", _page139],
  ["src/pages/payment/return.astro", _page140],
  ["src/pages/register.astro", _page141],
  ["src/pages/resources/index.astro", _page142],
  ["src/pages/reviews.astro", _page143],
  ["src/pages/rss.xml.ts", _page144],
  ["src/pages/scanner/pack.astro", _page145],
  ["src/pages/scanner/result/[id].astro", _page146],
  ["src/pages/scanner/test.astro", _page147],
  ["src/pages/scanner/[slug].astro", _page148],
  ["src/pages/scanner/index.astro", _page149],
  ["src/pages/search.astro", _page150],
  ["src/pages/verify-email.astro", _page151],
  ["src/pages/videos/index.astro", _page152],
  ["src/pages/index.astro", _page153]
]);
const _manifest = deserializeManifest({"rootDir":"file:///C:/dentalempireos/","cacheDir":"file:///C:/dentalempireos/node_modules/.astro/","outDir":"file:///C:/dentalempireos/dist2/","srcDir":"file:///C:/dentalempireos/src/","publicDir":"file:///C:/dentalempireos/public/","buildClientDir":"file:///C:/dentalempireos/dist2/client/","buildServerDir":"file:///C:/dentalempireos/dist2/server/","adapterName":"@astrojs/cloudflare","assetsDir":"_astro","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/_image","component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":".dev-notice-overlay[data-astro-cid-tt7gf3cz]{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:#121317e0;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}.dev-notice-card[data-astro-cid-tt7gf3cz]{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:3rem 2.5rem;margin:1rem;max-width:28rem;width:100%;background:#1e1f23f2;border:1px solid rgba(146,204,255,.15);border-radius:1.5rem;box-shadow:0 0 60px #92ccff0f;text-align:center}.dev-notice-icon[data-astro-cid-tt7gf3cz]{width:5rem;height:5rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:#92ccff1a;border:1px solid rgba(146,204,255,.2);margin-bottom:1rem}\nbody.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/account/clinic","isIndex":false,"type":"page","pattern":"^\\/account\\/clinic\\/?$","segments":[[{"content":"account","dynamic":false,"spread":false}],[{"content":"clinic","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/account/clinic.astro","pathname":"/account/clinic","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/account/profile","isIndex":false,"type":"page","pattern":"^\\/account\\/profile\\/?$","segments":[[{"content":"account","dynamic":false,"spread":false}],[{"content":"profile","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/account/profile.astro","pathname":"/account/profile","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/account/scanner-history","isIndex":false,"type":"page","pattern":"^\\/account\\/scanner-history\\/?$","segments":[[{"content":"account","dynamic":false,"spread":false}],[{"content":"scanner-history","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/account/scanner-history.astro","pathname":"/account/scanner-history","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/account/subscriptions","isIndex":false,"type":"page","pattern":"^\\/account\\/subscriptions\\/?$","segments":[[{"content":"account","dynamic":false,"spread":false}],[{"content":"subscriptions","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/account/subscriptions.astro","pathname":"/account/subscriptions","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/ai-settings","isIndex":false,"type":"page","pattern":"^\\/admin\\/ai-settings\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"ai-settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/ai-settings.astro","pathname":"/admin/ai-settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/apps/wizard","isIndex":false,"type":"page","pattern":"^\\/admin\\/apps\\/wizard\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"apps","dynamic":false,"spread":false}],[{"content":"wizard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/apps/wizard.astro","pathname":"/admin/apps/wizard","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/apps/[id]","isIndex":false,"type":"page","pattern":"^\\/admin\\/apps\\/([^/]+?)\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"apps","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/admin/apps/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"inline","content":".glass-card[data-astro-cid-srpfpfxd].group:hover{border-color:#92ccff26}tbody[data-astro-cid-srpfpfxd] tr[data-astro-cid-srpfpfxd]{position:relative}tbody[data-astro-cid-srpfpfxd] tr[data-astro-cid-srpfpfxd]:before{content:\"\";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--color-primary);border-radius:0 2px 2px 0;opacity:0;transition:opacity .15s ease}tbody[data-astro-cid-srpfpfxd] tr[data-astro-cid-srpfpfxd]:hover:before{opacity:1}tbody[data-astro-cid-srpfpfxd] tr[data-astro-cid-srpfpfxd]+tr[data-astro-cid-srpfpfxd]{border-top:1px solid rgba(63,72,80,.12)}span[data-astro-cid-srpfpfxd][class*=rounded-lg]{transition:all .15s ease}\n"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/apps","isIndex":true,"type":"page","pattern":"^\\/admin\\/apps\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"apps","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/apps/index.astro","pathname":"/admin/apps","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"inline","content":".cat-item[data-astro-cid-d27zo4ts]{position:relative}.cat-drag-handle[data-astro-cid-d27zo4ts]{cursor:grab}.cat-drag-handle[data-astro-cid-d27zo4ts]:active{cursor:grabbing}.cat-item[data-astro-cid-d27zo4ts].dragging{opacity:.35;transform:scale(1.01)}.cat-item[data-astro-cid-d27zo4ts].drag-zone-above:before,.cat-item[data-astro-cid-d27zo4ts].drag-zone-below:after{content:\"\";position:absolute;left:0;right:0;height:3px;background:var(--color-primary, #0d9488);border-radius:3px;animation:zone-line-expand .2s ease-out;pointer-events:none;z-index:10}.cat-item[data-astro-cid-d27zo4ts].drag-zone-above:before{top:-2px}.cat-item[data-astro-cid-d27zo4ts].drag-zone-below:after{bottom:-2px}.cat-item[data-astro-cid-d27zo4ts].drag-zone-into{box-shadow:inset 0 0 0 2px var(--color-primary, #0d9488)!important;background:color-mix(in srgb,var(--color-primary, #0d9488) 10%,transparent)!important;animation:zone-pulse .3s ease}@keyframes zone-line-expand{0%{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes zone-pulse{0%{box-shadow:inset 0 0 0 0 var(--color-primary, #0d9488)}50%{box-shadow:inset 0 0 0 3px var(--color-primary, #0d9488)}to{box-shadow:inset 0 0 0 2px var(--color-primary, #0d9488)}}.cat-item[data-astro-cid-d27zo4ts].collapsed .cat-children[data-astro-cid-d27zo4ts]{display:none}.cat-item[data-astro-cid-d27zo4ts].collapsed .cat-toggle[data-astro-cid-d27zo4ts] span[data-astro-cid-d27zo4ts]{transform:rotate(-90deg)}\n"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/blog/categories","isIndex":false,"type":"page","pattern":"^\\/admin\\/blog\\/categories\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/blog/categories.astro","pathname":"/admin/blog/categories","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/blog/new","isIndex":false,"type":"page","pattern":"^\\/admin\\/blog\\/new\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}],[{"content":"new","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/blog/new.astro","pathname":"/admin/blog/new","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/blog/tags","isIndex":false,"type":"page","pattern":"^\\/admin\\/blog\\/tags\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}],[{"content":"tags","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/blog/tags.astro","pathname":"/admin/blog/tags","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/blog/[id]","isIndex":false,"type":"page","pattern":"^\\/admin\\/blog\\/([^/]+?)\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/admin/blog/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/blog","isIndex":true,"type":"page","pattern":"^\\/admin\\/blog\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/blog/index.astro","pathname":"/admin/blog","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/courses/[id]","isIndex":false,"type":"page","pattern":"^\\/admin\\/courses\\/([^/]+?)\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"courses","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/admin/courses/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/courses","isIndex":true,"type":"page","pattern":"^\\/admin\\/courses\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"courses","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/courses/index.astro","pathname":"/admin/courses","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/ebooks/new","isIndex":false,"type":"page","pattern":"^\\/admin\\/ebooks\\/new\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"ebooks","dynamic":false,"spread":false}],[{"content":"new","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/ebooks/new.astro","pathname":"/admin/ebooks/new","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"},{"type":"inline","content":"[data-astro-cid-t3qx55ok][data-section-item].dragging{opacity:.3;transition:opacity .2s ease}[data-astro-cid-t3qx55ok][data-drag-placeholder].drag-placeholder-line{height:4px;background:var(--color-primary);border-radius:2px;margin:-2px 0;box-shadow:0 0 8px var(--color-primary);animation:placeholder-pulse 1s ease-in-out infinite alternate;pointer-events:none;list-style:none}[data-astro-cid-t3qx55ok][data-drag-placeholder].drag-placeholder-box{border:2px dashed var(--color-primary);border-radius:8px;background:color-mix(in srgb,var(--color-primary) 8%,transparent);min-height:36px;display:flex;align-items:center;padding:0 12px;font-size:12px;color:var(--color-primary);opacity:.8;pointer-events:none;animation:placeholder-pulse 1s ease-in-out infinite alternate}@keyframes placeholder-pulse{0%{opacity:.5}to{opacity:1}}@keyframes zone-line-expand{0%{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes zone-pulse{0%{box-shadow:inset 0 0 0 0 var(--color-primary)}to{box-shadow:inset 0 0 0 2px var(--color-primary)}}[data-astro-cid-t3qx55ok][data-section-list]{transition:height .3s cubic-bezier(.4,0,.2,1),opacity .3s ease}.section-nestable[data-astro-cid-t3qx55ok]{transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .25s ease,box-shadow .25s ease,background-color .25s ease,border-color .25s ease}[data-astro-cid-t3qx55ok][data-section-item].reorder-success{animation:reorder-flash .5s ease}@keyframes reorder-flash{0%{background:color-mix(in srgb,var(--color-primary) 15%,transparent)}to{background:transparent}}.block-item{transition:transform .2s cubic-bezier(.4,0,.2,1),opacity .2s ease,box-shadow .2s ease;position:relative}.block-item.dragging{opacity:.35}.drag-above:before{content:\"\";position:absolute;left:0;right:0;top:-2px;height:3px;background:var(--color-primary);border-radius:3px;animation:zone-line-expand .2s ease-out}.drag-below:after{content:\"\";position:absolute;left:0;right:0;bottom:-2px;height:3px;background:var(--color-primary);border-radius:3px;animation:zone-line-expand .2s ease-out}.drag-above,.drag-below{position:relative}.move-tree-row[data-astro-cid-t3qx55ok]{display:flex;align-items:center;gap:6px;width:100%;padding:8px 10px;border-radius:8px;background:transparent;color:var(--color-on-surface, #fff);font-size:14px;text-align:left;cursor:pointer;transition:background .12s;border:1px solid transparent}.move-tree-row[data-astro-cid-t3qx55ok]:hover:not(:disabled){background:var(--color-surface-container-high, #2a2a2a)}.move-tree-row-selected[data-astro-cid-t3qx55ok]{background:color-mix(in srgb,var(--color-primary) 12%,transparent);border-color:color-mix(in srgb,var(--color-primary) 30%,transparent)}.move-tree-node[data-astro-cid-t3qx55ok]{margin-left:20px}.move-tree-node[data-astro-cid-t3qx55ok]:first-child{margin-top:2px}.move-tree-children[data-astro-cid-t3qx55ok]{animation:tree-expand .2s ease}@keyframes tree-expand{0%{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}.move-tree-toggle[data-astro-cid-t3qx55ok]{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:4px;cursor:pointer;transition:background .12s}.move-tree-toggle[data-astro-cid-t3qx55ok]:hover{background:var(--color-surface-container-high, #2a2a2a)}\n"}],"routeData":{"route":"/admin/ebooks/[id]","isIndex":false,"type":"page","pattern":"^\\/admin\\/ebooks\\/([^/]+?)\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"ebooks","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/admin/ebooks/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"inline","content":".drag-above[data-astro-cid-kqfowpa7]{border-top:2px solid var(--color-primary)!important;margin-top:4px}.drag-below[data-astro-cid-kqfowpa7]{border-bottom:2px solid var(--color-primary)!important;margin-bottom:4px}.drag-grid-active[data-astro-cid-kqfowpa7]{border:2px dashed var(--color-primary)!important;background:color-mix(in srgb,var(--color-primary) 5%,transparent)!important}.order-handle[data-astro-cid-kqfowpa7]{cursor:grab}.order-handle[data-astro-cid-kqfowpa7]:active{cursor:grabbing}\n"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/ebooks","isIndex":true,"type":"page","pattern":"^\\/admin\\/ebooks\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"ebooks","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/ebooks/index.astro","pathname":"/admin/ebooks","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/homepage","isIndex":false,"type":"page","pattern":"^\\/admin\\/homepage\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"homepage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/homepage.astro","pathname":"/admin/homepage","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/orders","isIndex":true,"type":"page","pattern":"^\\/admin\\/orders\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"orders","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/orders/index.astro","pathname":"/admin/orders","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/products","isIndex":true,"type":"page","pattern":"^\\/admin\\/products\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/products/index.astro","pathname":"/admin/products","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/questions/[id]","isIndex":false,"type":"page","pattern":"^\\/admin\\/questions\\/([^/]+?)\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"questions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/admin/questions/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/questions","isIndex":true,"type":"page","pattern":"^\\/admin\\/questions\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"questions","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/questions/index.astro","pathname":"/admin/questions","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/resources","isIndex":true,"type":"page","pattern":"^\\/admin\\/resources\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"resources","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/resources/index.astro","pathname":"/admin/resources","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/admin/scanners/ho-so-goc-re/edit","isIndex":false,"type":"page","pattern":"^\\/admin\\/scanners\\/ho-so-goc-re\\/edit\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanners","dynamic":false,"spread":false}],[{"content":"ho-so-goc-re","dynamic":false,"spread":false}],[{"content":"edit","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/scanners/ho-so-goc-re/edit.astro","pathname":"/admin/scanners/ho-so-goc-re/edit","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"inline","content":".line-clamp-1[data-astro-cid-aiq3ovzm]{overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}.line-clamp-6[data-astro-cid-aiq3ovzm]{overflow:hidden;display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical}\n"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/scanners/ho-so-goc-re","isIndex":false,"type":"page","pattern":"^\\/admin\\/scanners\\/ho-so-goc-re\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanners","dynamic":false,"spread":false}],[{"content":"ho-so-goc-re","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/scanners/ho-so-goc-re.astro","pathname":"/admin/scanners/ho-so-goc-re","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/scanners/[id]/response/[id]","isIndex":false,"type":"page","pattern":"^\\/admin\\/scanners\\/([^/]+?)\\/response\\/([^/]+?)\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanners","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"response","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id","id"],"component":"src/pages/admin/scanners/[id]/response/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/scanners/[id]/responses","isIndex":false,"type":"page","pattern":"^\\/admin\\/scanners\\/([^/]+?)\\/responses\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanners","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"responses","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/admin/scanners/[id]/responses.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/scanners/[id]","isIndex":false,"type":"page","pattern":"^\\/admin\\/scanners\\/([^/]+?)\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanners","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/admin/scanners/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/scanners","isIndex":true,"type":"page","pattern":"^\\/admin\\/scanners\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanners","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/scanners/index.astro","pathname":"/admin/scanners","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/settings/payos","isIndex":false,"type":"page","pattern":"^\\/admin\\/settings\\/payos\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}],[{"content":"payos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/settings/payos.astro","pathname":"/admin/settings/payos","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/settings/support","isIndex":false,"type":"page","pattern":"^\\/admin\\/settings\\/support\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}],[{"content":"support","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/settings/support.astro","pathname":"/admin/settings/support","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin/users","isIndex":true,"type":"page","pattern":"^\\/admin\\/users\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/users/index.astro","pathname":"/admin/users","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/AdminLayout.CHcnte5w.css"}],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/ai-mentor/[slug]","isIndex":false,"type":"page","pattern":"^\\/ai-mentor\\/([^/]+?)\\/?$","segments":[[{"content":"ai-mentor","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/ai-mentor/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/ai-tools","isIndex":false,"type":"page","pattern":"^\\/ai-tools\\/?$","segments":[[{"content":"ai-tools","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/ai-tools.astro","pathname":"/ai-tools","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/account/avatar","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/account\\/avatar\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"account","dynamic":false,"spread":false}],[{"content":"avatar","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/account/avatar.ts","pathname":"/api/account/avatar","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/account/clinic-profile","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/account\\/clinic-profile\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"account","dynamic":false,"spread":false}],[{"content":"clinic-profile","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/account/clinic-profile.ts","pathname":"/api/account/clinic-profile","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/account/logo-upload","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/account\\/logo-upload\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"account","dynamic":false,"spread":false}],[{"content":"logo-upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/account/logo-upload.ts","pathname":"/api/account/logo-upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/account/scanner-access","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/account\\/scanner-access\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"account","dynamic":false,"spread":false}],[{"content":"scanner-access","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/account/scanner-access.ts","pathname":"/api/account/scanner-access","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/ai-providers","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/ai-providers\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"ai-providers","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/ai-providers.ts","pathname":"/api/admin/ai-providers","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/ai-settings","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/ai-settings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"ai-settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/ai-settings.ts","pathname":"/api/admin/ai-settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/apps/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/apps\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"apps","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/apps/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/apps","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/apps\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"apps","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/apps/index.ts","pathname":"/api/admin/apps","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/beautify","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/beautify\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"beautify","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/beautify.ts","pathname":"/api/admin/beautify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/blocks/reorder","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/blocks\\/reorder\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blocks","dynamic":false,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/blocks/reorder.ts","pathname":"/api/admin/blocks/reorder","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/blocks/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/blocks\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blocks","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/blocks/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/blocks","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/blocks\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blocks","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/blocks/index.ts","pathname":"/api/admin/blocks","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/blog/blocks/reorder","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/blog\\/blocks\\/reorder\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}],[{"content":"blocks","dynamic":false,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/blog/blocks/reorder.ts","pathname":"/api/admin/blog/blocks/reorder","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/blog/blocks/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/blog\\/blocks\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}],[{"content":"blocks","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/blog/blocks/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/blog/blocks","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/blog\\/blocks\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}],[{"content":"blocks","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/blog/blocks/index.ts","pathname":"/api/admin/blog/blocks","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/blog/categories/reorder","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/blog\\/categories\\/reorder\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/blog/categories/reorder.ts","pathname":"/api/admin/blog/categories/reorder","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/blog/tags","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/blog\\/tags\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}],[{"content":"tags","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/blog/tags.ts","pathname":"/api/admin/blog/tags","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/blog/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/blog\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/blog/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/blog","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/blog\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/blog/index.ts","pathname":"/api/admin/blog","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/chapters/reorder","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/chapters\\/reorder\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"chapters","dynamic":false,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/chapters/reorder.ts","pathname":"/api/admin/chapters/reorder","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/chapters/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/chapters\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"chapters","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/chapters/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/chapters","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/chapters\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"chapters","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/chapters.ts","pathname":"/api/admin/chapters","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/courses/videos/[videoId]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/courses\\/videos\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"courses","dynamic":false,"spread":false}],[{"content":"videos","dynamic":false,"spread":false}],[{"content":"videoId","dynamic":true,"spread":false}]],"params":["videoId"],"component":"src/pages/api/admin/courses/videos/[videoId].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/courses/[id]/videos","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/courses\\/([^/]+?)\\/videos\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"courses","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"videos","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/courses/[id]/videos.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/courses/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/courses\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"courses","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/courses/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/courses","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/courses\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"courses","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/courses/index.ts","pathname":"/api/admin/courses","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/homepage-settings","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/homepage-settings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"homepage-settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/homepage-settings.ts","pathname":"/api/admin/homepage-settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/orders","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/orders\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"orders","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/orders/index.ts","pathname":"/api/admin/orders","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/payos-settings","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/payos-settings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"payos-settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/payos-settings.ts","pathname":"/api/admin/payos-settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/products/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/products\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/products/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/products","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/products\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/products/index.ts","pathname":"/api/admin/products","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/publish","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/publish\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"publish","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/publish.ts","pathname":"/api/admin/publish","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/questions/[id]/reply","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/questions\\/([^/]+?)\\/reply\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"questions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"reply","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/questions/[id]/reply.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/questions/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/questions\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"questions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/questions/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/questions","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/questions\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"questions","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/questions.ts","pathname":"/api/admin/questions","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/resources/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/resources\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"resources","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/resources/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/resources","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/resources\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"resources","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/resources.ts","pathname":"/api/admin/resources","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/scanner/regenerate-ai","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/scanner\\/regenerate-ai\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanner","dynamic":false,"spread":false}],[{"content":"regenerate-ai","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/scanner/regenerate-ai.ts","pathname":"/api/admin/scanner/regenerate-ai","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/scanner-definitions/[id]/sections/[sid]/questions/[qid]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/scanner-definitions\\/([^/]+?)\\/sections\\/([^/]+?)\\/questions\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanner-definitions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}],[{"content":"sid","dynamic":true,"spread":false}],[{"content":"questions","dynamic":false,"spread":false}],[{"content":"qid","dynamic":true,"spread":false}]],"params":["id","sid","qid"],"component":"src/pages/api/admin/scanner-definitions/[id]/sections/[sid]/questions/[qid].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/scanner-definitions/[id]/sections/[sid]/questions","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/scanner-definitions\\/([^/]+?)\\/sections\\/([^/]+?)\\/questions\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanner-definitions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}],[{"content":"sid","dynamic":true,"spread":false}],[{"content":"questions","dynamic":false,"spread":false}]],"params":["id","sid"],"component":"src/pages/api/admin/scanner-definitions/[id]/sections/[sid]/questions.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/scanner-definitions/[id]/sections/[sid]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/scanner-definitions\\/([^/]+?)\\/sections\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanner-definitions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}],[{"content":"sid","dynamic":true,"spread":false}]],"params":["id","sid"],"component":"src/pages/api/admin/scanner-definitions/[id]/sections/[sid].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/scanner-definitions/[id]/sections","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/scanner-definitions\\/([^/]+?)\\/sections\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanner-definitions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/scanner-definitions/[id]/sections.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/scanner-definitions/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/scanner-definitions\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanner-definitions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/scanner-definitions/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/scanner-definitions","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/scanner-definitions\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"scanner-definitions","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/scanner-definitions/index.ts","pathname":"/api/admin/scanner-definitions","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/sections/reorder","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/sections\\/reorder\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/sections/reorder.ts","pathname":"/api/admin/sections/reorder","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/sections/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/sections\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/sections/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/sections","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/sections\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/sections.ts","pathname":"/api/admin/sections","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/seed-all-new","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/seed-all-new\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"seed-all-new","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/seed-all-new.ts","pathname":"/api/admin/seed-all-new","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/seed-free-scanners","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/seed-free-scanners\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"seed-free-scanners","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/seed-free-scanners.ts","pathname":"/api/admin/seed-free-scanners","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/seed-ho-so-goc-re","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/seed-ho-so-goc-re\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"seed-ho-so-goc-re","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/seed-ho-so-goc-re.ts","pathname":"/api/admin/seed-ho-so-goc-re","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/seed-quy-trinh-check","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/seed-quy-trinh-check\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"seed-quy-trinh-check","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/seed-quy-trinh-check.ts","pathname":"/api/admin/seed-quy-trinh-check","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/seed-scanner/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/seed-scanner\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"seed-scanner","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/admin/seed-scanner/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/seed-tai-chinh-check","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/seed-tai-chinh-check\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"seed-tai-chinh-check","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/seed-tai-chinh-check.ts","pathname":"/api/admin/seed-tai-chinh-check","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/seed-tiep-don-check","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/seed-tiep-don-check\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"seed-tiep-don-check","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/seed-tiep-don-check.ts","pathname":"/api/admin/seed-tiep-don-check","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/support-settings","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/support-settings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"support-settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/support-settings.ts","pathname":"/api/admin/support-settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/upload","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/upload\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/upload.ts","pathname":"/api/admin/upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/users","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admin\\/users\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/users/index.ts","pathname":"/api/admin/users","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/wizard/create","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/wizard\\/create\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"wizard","dynamic":false,"spread":false}],[{"content":"create","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/wizard/create.ts","pathname":"/api/admin/wizard/create","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/admin/wizard/generate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/wizard\\/generate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"wizard","dynamic":false,"spread":false}],[{"content":"generate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/wizard/generate.ts","pathname":"/api/admin/wizard/generate","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/ai-mentor/chat","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/ai-mentor\\/chat\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"ai-mentor","dynamic":false,"spread":false}],[{"content":"chat","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/ai-mentor/chat.ts","pathname":"/api/ai-mentor/chat","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/app/[id]/chat","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/app\\/([^/]+?)\\/chat\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"app","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"chat","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/app/[id]/chat.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/app/[id]/run","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/app\\/([^/]+?)\\/run\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"app","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"run","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/app/[id]/run.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/auth/[...all]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth(?:\\/(.*?))?\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"...all","dynamic":true,"spread":true}]],"params":["...all"],"component":"src/pages/api/auth/[...all].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/blog-form","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/blog-form\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"blog-form","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/blog-form.ts","pathname":"/api/blog-form","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/debug-db","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/debug-db\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"debug-db","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/debug-db.ts","pathname":"/api/debug-db","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/newsletter","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/newsletter\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"newsletter","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/newsletter.ts","pathname":"/api/newsletter","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/notifications/read","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/notifications\\/read\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"notifications","dynamic":false,"spread":false}],[{"content":"read","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/notifications/read.ts","pathname":"/api/notifications/read","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/notifications/unread-count","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/notifications\\/unread-count\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"notifications","dynamic":false,"spread":false}],[{"content":"unread-count","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/notifications/unread-count.ts","pathname":"/api/notifications/unread-count","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/notifications","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/notifications\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"notifications","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/notifications.ts","pathname":"/api/notifications","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/og/chapter/[slug].svg","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/og\\/chapter\\/([^/]+?)\\.svg\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"og","dynamic":false,"spread":false}],[{"content":"chapter","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false},{"content":".svg","dynamic":false,"spread":false}]],"params":["slug"],"component":"src/pages/api/og/chapter/[slug].svg.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/payos/cancel-payment","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/payos\\/cancel-payment\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"payos","dynamic":false,"spread":false}],[{"content":"cancel-payment","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/payos/cancel-payment.ts","pathname":"/api/payos/cancel-payment","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/payos/check-access","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/payos\\/check-access\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"payos","dynamic":false,"spread":false}],[{"content":"check-access","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/payos/check-access.ts","pathname":"/api/payos/check-access","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/payos/create-payment","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/payos\\/create-payment\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"payos","dynamic":false,"spread":false}],[{"content":"create-payment","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/payos/create-payment.ts","pathname":"/api/payos/create-payment","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/payos/webhook","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/payos\\/webhook\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"payos","dynamic":false,"spread":false}],[{"content":"webhook","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/payos/webhook.ts","pathname":"/api/payos/webhook","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/public/reviews/latest","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/public\\/reviews\\/latest\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"public","dynamic":false,"spread":false}],[{"content":"reviews","dynamic":false,"spread":false}],[{"content":"latest","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/public/reviews/latest.ts","pathname":"/api/public/reviews/latest","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/public/reviews/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/public\\/reviews\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"public","dynamic":false,"spread":false}],[{"content":"reviews","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/public/reviews/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/public/reviews","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/public\\/reviews\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"public","dynamic":false,"spread":false}],[{"content":"reviews","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/public/reviews.ts","pathname":"/api/public/reviews","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/public/support-settings","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/public\\/support-settings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"public","dynamic":false,"spread":false}],[{"content":"support-settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/public/support-settings.ts","pathname":"/api/public/support-settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/questions/[id]/reply","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/questions\\/([^/]+?)\\/reply\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"questions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"reply","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/questions/[id]/reply.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/questions/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/questions\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"questions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/questions/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/questions","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/questions\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"questions","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/questions.ts","pathname":"/api/questions","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/reading-progress/unlock-check","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/reading-progress\\/unlock-check\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"reading-progress","dynamic":false,"spread":false}],[{"content":"unlock-check","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/reading-progress/unlock-check.ts","pathname":"/api/reading-progress/unlock-check","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/reading-progress","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/reading-progress\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"reading-progress","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/reading-progress.ts","pathname":"/api/reading-progress","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/scanner/check-access","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/scanner\\/check-access\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"scanner","dynamic":false,"spread":false}],[{"content":"check-access","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/scanner/check-access.ts","pathname":"/api/scanner/check-access","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/scanner/run-ai","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/scanner\\/run-ai\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"scanner","dynamic":false,"spread":false}],[{"content":"run-ai","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/scanner/run-ai.ts","pathname":"/api/scanner/run-ai","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/scanner/submit","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/scanner\\/submit\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"scanner","dynamic":false,"spread":false}],[{"content":"submit","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/scanner/submit.ts","pathname":"/api/scanner/submit","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/scanner/[id]/pdf","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/scanner\\/([^/]+?)\\/pdf\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"scanner","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"pdf","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/scanner/[id]/pdf.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/scanner/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/scanner\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"scanner","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/scanner/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/api/seeds/list","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/seeds\\/list\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"seeds","dynamic":false,"spread":false}],[{"content":"list","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/seeds/list.ts","pathname":"/api/seeds/list","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"external","src":"_astro/_slug_.DEg0HL7O.css"}],"routeData":{"route":"/app/[slug]","isIndex":false,"type":"page","pattern":"^\\/app\\/([^/]+?)\\/?$","segments":[[{"content":"app","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/app/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/blog/category/[category]","isIndex":true,"type":"page","pattern":"^\\/blog\\/category\\/([^/]+?)\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"category","dynamic":false,"spread":false}],[{"content":"category","dynamic":true,"spread":false}]],"params":["category"],"component":"src/pages/blog/category/[category]/index.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":".blog-section-sheet[data-astro-cid-cztwtgcr]{transform:translateY(100%);transition:transform .35s cubic-bezier(.4,0,.2,1)}.blog-section-sheet[data-astro-cid-cztwtgcr].blog-section-open{transform:translateY(0)!important}[data-astro-cid-cztwtgcr][data-blog-section-link].blog-section-active{border-color:var(--color-primary, #92ccff)!important;background:#92ccff14!important;color:var(--color-primary, #92ccff)!important}[data-astro-cid-cztwtgcr][data-blog-section-link]{scroll-margin-top:5rem}body.blog-toc-open #mobile-bottom-nav{transform:translateY(100%)!important;pointer-events:none!important}\nbody.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/blog/[slug]","isIndex":false,"type":"page","pattern":"^\\/blog\\/([^/]+?)\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/blog/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":".dev-notice-overlay[data-astro-cid-tt7gf3cz]{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:#121317e0;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}.dev-notice-card[data-astro-cid-tt7gf3cz]{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:3rem 2.5rem;margin:1rem;max-width:28rem;width:100%;background:#1e1f23f2;border:1px solid rgba(146,204,255,.15);border-radius:1.5rem;box-shadow:0 0 60px #92ccff0f;text-align:center}.dev-notice-icon[data-astro-cid-tt7gf3cz]{width:5rem;height:5rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:#92ccff1a;border:1px solid rgba(146,204,255,.2);margin-bottom:1rem}\nbody.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/book","isIndex":true,"type":"page","pattern":"^\\/book\\/?$","segments":[[{"content":"book","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/book/index.astro","pathname":"/book","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":".donate-qr-wrap[data-astro-cid-fuyrfybf]{transition:box-shadow .3s ease,transform .3s ease}.donate-qr-wrap[data-astro-cid-fuyrfybf]:hover{box-shadow:0 8px 40px #92ccff33;transform:translateY(-2px)}\n"},{"type":"external","src":"_astro/_..DdqGQSrB.css"},{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"inline","content":".star-rating label.star-label:hover span,.star-rating label.star-label:hover~label.star-label span{color:#facc15;opacity:1}.star-rating input:checked~label.star-label span{color:#facc15;opacity:1}\n"}],"routeData":{"route":"/book/[...slug]","isIndex":false,"type":"page","pattern":"^\\/book(?:\\/(.*?))?\\/?$","segments":[[{"content":"book","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/book/[...slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/courses/[id]","isIndex":false,"type":"page","pattern":"^\\/courses\\/([^/]+?)\\/?$","segments":[[{"content":"courses","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/courses/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/courses","isIndex":true,"type":"page","pattern":"^\\/courses\\/?$","segments":[[{"content":"courses","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/courses/index.astro","pathname":"/courses","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/media/[...key]","isIndex":false,"type":"endpoint","pattern":"^\\/media(?:\\/(.*?))?\\/?$","segments":[[{"content":"media","dynamic":false,"spread":false}],[{"content":"...key","dynamic":true,"spread":true}]],"params":["...key"],"component":"src/pages/media/[...key].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/my-questions/[id]","isIndex":false,"type":"page","pattern":"^\\/my-questions\\/([^/]+?)\\/?$","segments":[[{"content":"my-questions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/my-questions/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/my-questions","isIndex":true,"type":"page","pattern":"^\\/my-questions\\/?$","segments":[[{"content":"my-questions","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/my-questions/index.astro","pathname":"/my-questions","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/payment/cancel","isIndex":false,"type":"page","pattern":"^\\/payment\\/cancel\\/?$","segments":[[{"content":"payment","dynamic":false,"spread":false}],[{"content":"cancel","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/payment/cancel.astro","pathname":"/payment/cancel","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/payment/return","isIndex":false,"type":"page","pattern":"^\\/payment\\/return\\/?$","segments":[[{"content":"payment","dynamic":false,"spread":false}],[{"content":"return","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/payment/return.astro","pathname":"/payment/return","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/register","isIndex":false,"type":"page","pattern":"^\\/register\\/?$","segments":[[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/register.astro","pathname":"/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/resources","isIndex":true,"type":"page","pattern":"^\\/resources\\/?$","segments":[[{"content":"resources","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/resources/index.astro","pathname":"/resources","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n.star-rating label.star-label:hover span,.star-rating label.star-label:hover~label.star-label span{color:#facc15;opacity:1}.star-rating input:checked~label.star-label span{color:#facc15;opacity:1}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/reviews","isIndex":false,"type":"page","pattern":"^\\/reviews\\/?$","segments":[[{"content":"reviews","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/reviews.astro","pathname":"/reviews","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/scanner/pack","isIndex":false,"type":"page","pattern":"^\\/scanner\\/pack\\/?$","segments":[[{"content":"scanner","dynamic":false,"spread":false}],[{"content":"pack","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/scanner/pack.astro","pathname":"/scanner/pack","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"},{"type":"external","src":"_astro/_id_.ZrnCxgC9.css"}],"routeData":{"route":"/scanner/result/[id]","isIndex":false,"type":"page","pattern":"^\\/scanner\\/result\\/([^/]+?)\\/?$","segments":[[{"content":"scanner","dynamic":false,"spread":false}],[{"content":"result","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/scanner/result/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/scanner/test","isIndex":false,"type":"page","pattern":"^\\/scanner\\/test\\/?$","segments":[[{"content":"scanner","dynamic":false,"spread":false}],[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/scanner/test.astro","pathname":"/scanner/test","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/_slug_.BuxjIUFw.css"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/scanner/[slug]","isIndex":false,"type":"page","pattern":"^\\/scanner\\/([^/]+?)\\/?$","segments":[[{"content":"scanner","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/scanner/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/scanner","isIndex":true,"type":"page","pattern":"^\\/scanner\\/?$","segments":[[{"content":"scanner","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/scanner/index.astro","pathname":"/scanner","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/search","isIndex":false,"type":"page","pattern":"^\\/search\\/?$","segments":[[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/search.astro","pathname":"/search","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":"body.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/verify-email","isIndex":false,"type":"page","pattern":"^\\/verify-email\\/?$","segments":[[{"content":"verify-email","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/verify-email.astro","pathname":"/verify-email","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":".dev-notice-overlay[data-astro-cid-tt7gf3cz]{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:#121317e0;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}.dev-notice-card[data-astro-cid-tt7gf3cz]{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:3rem 2.5rem;margin:1rem;max-width:28rem;width:100%;background:#1e1f23f2;border:1px solid rgba(146,204,255,.15);border-radius:1.5rem;box-shadow:0 0 60px #92ccff0f;text-align:center}.dev-notice-icon[data-astro-cid-tt7gf3cz]{width:5rem;height:5rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:#92ccff1a;border:1px solid rgba(146,204,255,.2);margin-bottom:1rem}\nbody.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/videos","isIndex":true,"type":"page","pattern":"^\\/videos\\/?$","segments":[[{"content":"videos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/videos/index.astro","pathname":"/videos","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.B9eF5IcF.js"}],"styles":[{"type":"inline","content":".donate-qr-wrap[data-astro-cid-fuyrfybf]{transition:box-shadow .3s ease,transform .3s ease}.donate-qr-wrap[data-astro-cid-fuyrfybf]:hover{box-shadow:0 8px 40px #92ccff33;transform:translateY(-2px)}\nbody.drawer-open{overflow:hidden}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chapters[data-astro-cid-wsizw3ik]{display:block}.tier-group[data-astro-cid-wsizw3ik][data-expanded=true] .tier-chevron[data-astro-cid-wsizw3ik]{transform:rotate(180deg)}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar{width:4px}#chapter-drawer-content[data-astro-cid-wsizw3ik]::-webkit-scrollbar-thumb{background:var(--reader-scrollbar);border-radius:4px}@supports (padding-bottom: env(safe-area-inset-bottom)){#mobile-bottom-nav[data-astro-cid-wsizw3ik]{padding-bottom:env(safe-area-inset-bottom)}}#pwa-install-prompt[data-astro-cid-lryo33yu].is-visible{display:block!important;animation:pwa-slide-up .4s cubic-bezier(.16,1,.3,1)}@keyframes pwa-slide-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toast-in{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}@keyframes toast-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(100%)}}@keyframes toast-progress{0%{width:100%}to{width:0%}}.toast[data-astro-cid-37fxchfa]{display:flex;align-items:center;gap:10px;min-width:280px;max-width:380px;padding:12px 16px;background:#1c1c28;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 8px 24px #0006;animation:toast-in .3s cubic-bezier(.4,0,.2,1) forwards;pointer-events:auto;position:relative;overflow:hidden}.toast[data-astro-cid-37fxchfa].toast-success{border-left:3px solid #4ade80}.toast[data-astro-cid-37fxchfa].toast-error{border-left:3px solid #f87171}.toast[data-astro-cid-37fxchfa].toast-info{border-left:3px solid #60a5fa}.toast[data-astro-cid-37fxchfa].toast-out{animation:toast-out .3s cubic-bezier(.4,0,.2,1) forwards}.toast-progress[data-astro-cid-37fxchfa]{position:absolute;bottom:0;left:0;height:2px;background:#ffffff26;animation:toast-progress linear forwards}.toast[data-astro-cid-37fxchfa].toast-success .toast-progress[data-astro-cid-37fxchfa]{background:#4ade80}.toast[data-astro-cid-37fxchfa].toast-error .toast-progress[data-astro-cid-37fxchfa]{background:#f87171}.toast[data-astro-cid-37fxchfa].toast-info .toast-progress[data-astro-cid-37fxchfa]{background:#60a5fa}\n"},{"type":"external","src":"_astro/global.DYUxPwJ_.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"serverLike":true,"middlewareMode":"classic","site":"https://dentalempireos.com","base":"/","trailingSlash":"ignore","compressHTML":true,"experimentalQueuedRendering":{"enabled":false,"poolSize":0,"contentCache":false},"componentMetadata":[["C:/dentalempireos/src/pages/app/[slug].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/ai-settings.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/apps/[id].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/apps/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/apps/wizard.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/blog/[id].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/blog/categories.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/blog/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/blog/new.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/blog/tags.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/courses/[id].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/courses/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/ebooks/[id].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/ebooks/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/ebooks/new.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/homepage.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/orders/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/products/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/questions/[id].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/questions/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/resources/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/scanners/[id].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/scanners/[id]/response/[id].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/scanners/[id]/responses.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/scanners/ho-so-goc-re.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/scanners/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/settings/payos.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/settings/support.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/admin/users/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/book/[...slug].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/about.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/account/clinic.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/account/profile.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/account/scanner-history.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/account/subscriptions.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/ai-mentor/[slug].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/ai-tools.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/blog/[slug].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/blog/category/[category]/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/blog/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/book/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/courses/[id].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/courses/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/login.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/my-questions/[id].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/my-questions/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/payment/cancel.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/payment/return.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/register.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/resources/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/reviews.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/scanner/[slug].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/scanner/index.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/scanner/pack.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/scanner/result/[id].astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/scanner/test.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/search.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/verify-email.astro",{"propagation":"none","containsHead":true}],["C:/dentalempireos/src/pages/videos/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"C:/dentalempireos/node_modules/better-auth/dist/adapters/kysely-adapter/index.mjs":"chunks/index_CwBXRZ-t.mjs","\u0000virtual:astro:actions/noop-entrypoint":"chunks/noop-entrypoint_DsBX4kaI.mjs","\u0000virtual:astro:server-island-manifest":"chunks/_virtual_astro_server-island-manifest_CFl7y3Qj.mjs","C:/dentalempireos/node_modules/@better-auth/kysely-adapter/dist/bun-sqlite-dialect-BW9W1_Ps.mjs":"chunks/bun-sqlite-dialect-BW9W1_Ps_Cv3O9gfX.mjs","C:/dentalempireos/node_modules/@better-auth/kysely-adapter/dist/node-sqlite-dialect.mjs":"chunks/node-sqlite-dialect_Dr8JnlyS.mjs","C:/dentalempireos/node_modules/@better-auth/kysely-adapter/dist/d1-sqlite-dialect-BLC8LXE6.mjs":"chunks/d1-sqlite-dialect-BLC8LXE6_B544KGEF.mjs","C:/dentalempireos/node_modules/@better-auth/memory-adapter/dist/index.mjs":"chunks/index_DeRg8PEg.mjs","\u0000virtual:astro:session-driver":"chunks/_virtual_astro_session-driver_Csu6PJY6.mjs","virtual:cloudflare/worker-entry":"entry.mjs","\u0000virtual:astro:middleware":"virtual_astro_middleware.mjs","C:/dentalempireos/src/lib/blog-db.ts":"chunks/blog-db_CoZeeOQQ.mjs","C:/dentalempireos/node_modules/@astrojs/cloudflare/dist/entrypoints/image-service-workerd.js":"chunks/image-service-workerd_BFfk0COo.mjs","__vite-optional-peer-dep:@react-email/render:resend:false":"chunks/render_resend_false_VXizwFaD.mjs","\u0000virtual:astro:page:src/pages/account/clinic@_@astro":"chunks/clinic_C7wkm_q6.mjs","\u0000virtual:astro:page:src/pages/account/scanner-history@_@astro":"chunks/scanner-history_DuQf_EPA.mjs","\u0000virtual:astro:page:src/pages/account/subscriptions@_@astro":"chunks/subscriptions_BY8jvwbR.mjs","\u0000virtual:astro:page:src/pages/admin/ai-settings@_@astro":"chunks/ai-settings_DbtAJ_VF.mjs","\u0000virtual:astro:page:src/pages/admin/apps/wizard@_@astro":"chunks/wizard_BzQ_UIXH.mjs","\u0000virtual:astro:page:src/pages/admin/apps/[id]@_@astro":"chunks/_id__oTbaY74F.mjs","\u0000virtual:astro:page:src/pages/admin/blog/new@_@astro":"chunks/new_BjmqxZPr.mjs","\u0000virtual:astro:page:src/pages/admin/blog/tags@_@astro":"chunks/tags_DP0ZJ9o_.mjs","\u0000virtual:astro:page:src/pages/admin/blog/[id]@_@astro":"chunks/_id__wj4DtmVu.mjs","\u0000virtual:astro:page:src/pages/admin/blog/index@_@astro":"chunks/index_BsLnBQ04.mjs","\u0000virtual:astro:page:src/pages/admin/courses/[id]@_@astro":"chunks/_id__Cqqnzumc.mjs","\u0000virtual:astro:page:src/pages/admin/courses/index@_@astro":"chunks/index_Dug4yN7q.mjs","\u0000virtual:astro:page:src/pages/admin/ebooks/new@_@astro":"chunks/new_Ch9KtQbh.mjs","\u0000virtual:astro:page:src/pages/admin/homepage@_@astro":"chunks/homepage_B9EJTLHd.mjs","\u0000virtual:astro:page:src/pages/admin/orders/index@_@astro":"chunks/index_B_nemo7z.mjs","\u0000virtual:astro:page:src/pages/admin/products/index@_@astro":"chunks/index_CI2H6nIS.mjs","\u0000virtual:astro:page:src/pages/admin/questions/[id]@_@astro":"chunks/_id__C8mBqawO.mjs","\u0000virtual:astro:page:src/pages/admin/questions/index@_@astro":"chunks/index_Czawbm5G.mjs","\u0000virtual:astro:page:src/pages/admin/resources/index@_@astro":"chunks/index_Bf5zkshd.mjs","\u0000virtual:astro:page:src/pages/admin/scanners/ho-so-goc-re/edit@_@astro":"chunks/edit_CvHE3xtS.mjs","\u0000virtual:astro:page:src/pages/admin/scanners/[id]/response/[id]@_@astro":"chunks/_id__D35tfHp3.mjs","\u0000virtual:astro:page:src/pages/admin/scanners/[id]/responses@_@astro":"chunks/responses_rs4EYwGC.mjs","\u0000virtual:astro:page:src/pages/admin/scanners/[id]@_@astro":"chunks/_id__d6CmlEhq.mjs","\u0000virtual:astro:page:src/pages/admin/scanners/index@_@astro":"chunks/index_Cd2Ot2EY.mjs","\u0000virtual:astro:page:src/pages/admin/settings/payos@_@astro":"chunks/payos_wNoxf_PS.mjs","\u0000virtual:astro:page:src/pages/admin/settings/support@_@astro":"chunks/support_BA7toCIx.mjs","\u0000virtual:astro:page:src/pages/admin/users/index@_@astro":"chunks/index_DxuooOFO.mjs","\u0000virtual:astro:page:src/pages/ai-mentor/[slug]@_@astro":"chunks/_slug__CGjccvbn.mjs","\u0000virtual:astro:page:src/pages/ai-tools@_@astro":"chunks/ai-tools_JIGO1sOx.mjs","\u0000virtual:astro:page:src/pages/api/account/avatar@_@ts":"chunks/avatar_BPYTN4RV.mjs","\u0000virtual:astro:page:src/pages/api/account/clinic-profile@_@ts":"chunks/clinic-profile_BotpftHZ.mjs","\u0000virtual:astro:page:src/pages/api/account/logo-upload@_@ts":"chunks/logo-upload_DVUBCPcM.mjs","\u0000virtual:astro:page:src/pages/api/account/scanner-access@_@ts":"chunks/scanner-access_p2-qwh5L.mjs","\u0000virtual:astro:page:src/pages/api/admin/ai-providers@_@ts":"chunks/ai-providers_C60vyQDO.mjs","\u0000virtual:astro:page:src/pages/api/admin/ai-settings@_@ts":"chunks/ai-settings_CyQvvmSc.mjs","\u0000virtual:astro:page:src/pages/api/admin/apps/[id]@_@ts":"chunks/_id__Dmk_00Fz.mjs","\u0000virtual:astro:page:src/pages/api/admin/apps/index@_@ts":"chunks/index_B4UbSFOb.mjs","\u0000virtual:astro:page:src/pages/api/admin/beautify@_@ts":"chunks/beautify_DDqw6o_e.mjs","\u0000virtual:astro:page:src/pages/api/admin/blocks/reorder@_@ts":"chunks/reorder_BzwXBwek.mjs","\u0000virtual:astro:page:src/pages/api/admin/blocks/[id]@_@ts":"chunks/_id__x4j764JF.mjs","\u0000virtual:astro:page:src/pages/api/admin/blocks/index@_@ts":"chunks/index_5ByLo5sb.mjs","\u0000virtual:astro:page:src/pages/api/admin/blog/blocks/reorder@_@ts":"chunks/reorder_DozK0CS0.mjs","\u0000virtual:astro:page:src/pages/api/admin/blog/blocks/[id]@_@ts":"chunks/_id__BnRfhaYO.mjs","\u0000virtual:astro:page:src/pages/api/admin/blog/blocks/index@_@ts":"chunks/index_B3DpKU82.mjs","\u0000virtual:astro:page:src/pages/api/admin/blog/categories/reorder@_@ts":"chunks/reorder_Beywf6G-.mjs","\u0000virtual:astro:page:src/pages/api/admin/blog/tags@_@ts":"chunks/tags_Dl7JD0qO.mjs","\u0000virtual:astro:page:src/pages/api/admin/blog/[id]@_@ts":"chunks/_id__CeA7Qr_F.mjs","\u0000virtual:astro:page:src/pages/api/admin/blog/index@_@ts":"chunks/index_BuzMRAvM.mjs","\u0000virtual:astro:page:src/pages/api/admin/chapters/reorder@_@ts":"chunks/reorder_UFMISrG3.mjs","\u0000virtual:astro:page:src/pages/api/admin/chapters/[id]@_@ts":"chunks/_id__DAYnqL3E.mjs","\u0000virtual:astro:page:src/pages/api/admin/chapters@_@ts":"chunks/chapters_B4Nc5drH.mjs","\u0000virtual:astro:page:src/pages/api/admin/courses/videos/[videoId]@_@ts":"chunks/_videoId__Dh3cHNDa.mjs","\u0000virtual:astro:page:src/pages/api/admin/courses/[id]/videos@_@ts":"chunks/videos_94ONevuv.mjs","\u0000virtual:astro:page:src/pages/api/admin/courses/[id]@_@ts":"chunks/_id__CxcJJ5B4.mjs","\u0000virtual:astro:page:src/pages/api/admin/courses/index@_@ts":"chunks/index_Ck5ab38i.mjs","\u0000virtual:astro:page:src/pages/api/admin/homepage-settings@_@ts":"chunks/homepage-settings_D_SdYktE.mjs","\u0000virtual:astro:page:src/pages/api/admin/orders/index@_@ts":"chunks/index_BB8G2l4B.mjs","\u0000virtual:astro:page:src/pages/api/admin/payos-settings@_@ts":"chunks/payos-settings_CjtcXDct.mjs","\u0000virtual:astro:page:src/pages/api/admin/products/[id]@_@ts":"chunks/_id__ByDIrt1P.mjs","\u0000virtual:astro:page:src/pages/api/admin/products/index@_@ts":"chunks/index_DnFplHR1.mjs","\u0000virtual:astro:page:src/pages/api/admin/publish@_@ts":"chunks/publish_wDqqF9X8.mjs","\u0000virtual:astro:page:src/pages/api/admin/questions/[id]/reply@_@ts":"chunks/reply_oc56BuYY.mjs","\u0000virtual:astro:page:src/pages/api/admin/questions/[id]@_@ts":"chunks/_id__Dx4rBCgW.mjs","\u0000virtual:astro:page:src/pages/api/admin/questions@_@ts":"chunks/questions_Bz9Wm0Fr.mjs","\u0000virtual:astro:page:src/pages/api/admin/resources/[id]@_@ts":"chunks/_id__DzD79NU9.mjs","\u0000virtual:astro:page:src/pages/api/admin/resources@_@ts":"chunks/resources_DoN32hEz.mjs","\u0000virtual:astro:page:src/pages/api/admin/scanner/regenerate-ai@_@ts":"chunks/regenerate-ai_DP9b0tJk.mjs","\u0000virtual:astro:page:src/pages/api/admin/scanner-definitions/[id]/sections/[sid]/questions/[qid]@_@ts":"chunks/_qid__BvNVcaBT.mjs","\u0000virtual:astro:page:src/pages/api/admin/scanner-definitions/[id]/sections/[sid]/questions@_@ts":"chunks/questions_DhuBdl87.mjs","\u0000virtual:astro:page:src/pages/api/admin/scanner-definitions/[id]/sections/[sid]@_@ts":"chunks/_sid__CIDRWpZ2.mjs","\u0000virtual:astro:page:src/pages/api/admin/scanner-definitions/[id]/sections@_@ts":"chunks/sections_DxlAshTz.mjs","\u0000virtual:astro:page:src/pages/api/admin/scanner-definitions/[id]@_@ts":"chunks/_id__qq0ErevS.mjs","\u0000virtual:astro:page:src/pages/api/admin/scanner-definitions/index@_@ts":"chunks/index_Wzx30knb.mjs","\u0000virtual:astro:page:src/pages/api/admin/sections/reorder@_@ts":"chunks/reorder_BMss_88X.mjs","\u0000virtual:astro:page:src/pages/api/admin/sections/[id]@_@ts":"chunks/_id__CKqWUQ7Y.mjs","\u0000virtual:astro:page:src/pages/api/admin/sections@_@ts":"chunks/sections_pjoKu6TR.mjs","\u0000virtual:astro:page:src/pages/api/admin/seed-all-new@_@ts":"chunks/seed-all-new_SYDiyMnS.mjs","\u0000virtual:astro:page:src/pages/api/admin/seed-free-scanners@_@ts":"chunks/seed-free-scanners_CXOe3Gqj.mjs","\u0000virtual:astro:page:src/pages/api/admin/seed-ho-so-goc-re@_@ts":"chunks/seed-ho-so-goc-re_CESs0ADR.mjs","\u0000virtual:astro:page:src/pages/api/admin/seed-quy-trinh-check@_@ts":"chunks/seed-quy-trinh-check_D1lcv4oU.mjs","\u0000virtual:astro:page:src/pages/api/admin/seed-scanner/[id]@_@ts":"chunks/_id__Bu2AqVsA.mjs","\u0000virtual:astro:page:src/pages/api/admin/seed-tai-chinh-check@_@ts":"chunks/seed-tai-chinh-check_o8UFL6TK.mjs","\u0000virtual:astro:page:src/pages/api/admin/seed-tiep-don-check@_@ts":"chunks/seed-tiep-don-check_DReEFTUf.mjs","\u0000virtual:astro:page:src/pages/api/admin/support-settings@_@ts":"chunks/support-settings_CLxIrWvu.mjs","\u0000virtual:astro:page:src/pages/api/admin/upload@_@ts":"chunks/upload_CUt5sj7Z.mjs","\u0000virtual:astro:page:src/pages/api/admin/users/index@_@ts":"chunks/index_BoqqtZ6H.mjs","\u0000virtual:astro:page:src/pages/api/admin/wizard/create@_@ts":"chunks/create_nDRR915D.mjs","\u0000virtual:astro:page:src/pages/api/app/[id]/chat@_@ts":"chunks/chat_CsjpTPSJ.mjs","\u0000virtual:astro:page:src/pages/api/app/[id]/run@_@ts":"chunks/run_Ch2gjCQw.mjs","\u0000virtual:astro:page:src/pages/api/auth/[...all]@_@ts":"chunks/_.._abphtoom.mjs","\u0000virtual:astro:page:src/pages/api/blog-form@_@ts":"chunks/blog-form_DGJ39mc7.mjs","\u0000virtual:astro:page:src/pages/api/debug-db@_@ts":"chunks/debug-db_ChI0yDcD.mjs","\u0000virtual:astro:page:src/pages/api/notifications/read@_@ts":"chunks/read_BZPGr0f_.mjs","\u0000virtual:astro:page:src/pages/api/notifications/unread-count@_@ts":"chunks/unread-count_CDudvLg7.mjs","\u0000virtual:astro:page:src/pages/api/notifications@_@ts":"chunks/notifications_BP5HammE.mjs","\u0000virtual:astro:page:src/pages/api/og/chapter/[slug].svg@_@ts":"chunks/_slug__Bs6M5Kcg.mjs","\u0000virtual:astro:page:src/pages/api/payos/cancel-payment@_@ts":"chunks/cancel-payment_DLGmiCsw.mjs","\u0000virtual:astro:page:src/pages/api/payos/create-payment@_@ts":"chunks/create-payment_93OTR5YC.mjs","\u0000virtual:astro:page:src/pages/api/payos/webhook@_@ts":"chunks/webhook_Dos0ipd4.mjs","\u0000virtual:astro:page:src/pages/api/public/reviews/latest@_@ts":"chunks/latest_CH76gp5s.mjs","\u0000virtual:astro:page:src/pages/api/public/reviews/[id]@_@ts":"chunks/_id__B-BhIHXh.mjs","\u0000virtual:astro:page:src/pages/api/public/reviews@_@ts":"chunks/reviews_CNloZj6p.mjs","\u0000virtual:astro:page:src/pages/api/public/support-settings@_@ts":"chunks/support-settings_CjangZV9.mjs","\u0000virtual:astro:page:src/pages/api/questions/[id]/reply@_@ts":"chunks/reply_COE5mpbb.mjs","\u0000virtual:astro:page:src/pages/api/questions/[id]@_@ts":"chunks/_id__DbQ-DZdj.mjs","\u0000virtual:astro:page:src/pages/api/questions@_@ts":"chunks/questions_C0tIvgon.mjs","\u0000virtual:astro:page:src/pages/api/reading-progress/unlock-check@_@ts":"chunks/unlock-check_Cet4QDFy.mjs","\u0000virtual:astro:page:src/pages/api/reading-progress@_@ts":"chunks/reading-progress_CLU06azF.mjs","\u0000virtual:astro:page:src/pages/api/scanner/check-access@_@ts":"chunks/check-access_DYplKxNN.mjs","\u0000virtual:astro:page:src/pages/api/scanner/run-ai@_@ts":"chunks/run-ai_DLBdbyL4.mjs","\u0000virtual:astro:page:src/pages/api/scanner/submit@_@ts":"chunks/submit_D_XhpkZT.mjs","\u0000virtual:astro:page:src/pages/api/scanner/[id]@_@ts":"chunks/_id__Bk2rN1nM.mjs","\u0000virtual:astro:page:src/pages/api/seeds/list@_@ts":"chunks/list_sHYUkP3n.mjs","\u0000virtual:astro:page:src/pages/blog/category/[category]/index@_@astro":"chunks/index_C56o7728.mjs","\u0000virtual:astro:page:src/pages/blog/index@_@astro":"chunks/index_CTtQ8KcF.mjs","\u0000virtual:astro:page:src/pages/login@_@astro":"chunks/login_BdIJpdKd.mjs","\u0000virtual:astro:page:src/pages/media/[...key]@_@ts":"chunks/_.._C1Otdv7N.mjs","\u0000virtual:astro:page:src/pages/my-questions/index@_@astro":"chunks/index_DwaWeNUE.mjs","\u0000virtual:astro:page:src/pages/payment/cancel@_@astro":"chunks/cancel_Bkiza3EL.mjs","\u0000virtual:astro:page:src/pages/payment/return@_@astro":"chunks/return_BDEywhXs.mjs","\u0000virtual:astro:page:src/pages/register@_@astro":"chunks/register_jhJ2nzcD.mjs","\u0000virtual:astro:page:src/pages/resources/index@_@astro":"chunks/index_BuXCBF-p.mjs","\u0000virtual:astro:page:src/pages/scanner/pack@_@astro":"chunks/pack_CjQdygxs.mjs","\u0000virtual:astro:page:src/pages/scanner/test@_@astro":"chunks/test_DfWFRFA3.mjs","\u0000virtual:astro:page:src/pages/scanner/index@_@astro":"chunks/index_flZG26T6.mjs","\u0000virtual:astro:page:src/pages/search@_@astro":"chunks/search_DD7Y2L_T.mjs","\u0000virtual:astro:page:src/pages/verify-email@_@astro":"chunks/verify-email_CSwpy9lW.mjs","\u0000virtual:astro:page:src/pages/videos/index@_@astro":"chunks/index_WlUpzUXM.mjs","\u0000virtual:astro:page:src/pages/index@_@astro":"chunks/index_nKgYD2C1.mjs","\u0000virtual:astro:page:src/pages/about@_@astro":"chunks/about_DzTLwK4N.mjs","\u0000virtual:astro:page:src/pages/account/profile@_@astro":"chunks/profile_CJ-HI0Tr.mjs","\u0000virtual:astro:page:src/pages/admin/apps/index@_@astro":"chunks/index_CfbLrjJV.mjs","\u0000virtual:astro:page:src/pages/admin/blog/categories@_@astro":"chunks/categories_sd6apdTc.mjs","\u0000virtual:astro:page:src/pages/admin/ebooks/index@_@astro":"chunks/index_CgbcoGO-.mjs","\u0000virtual:astro:page:src/pages/admin/scanners/ho-so-goc-re@_@astro":"chunks/ho-so-goc-re_D9Y8i9HF.mjs","\u0000virtual:astro:page:src/pages/admin/index@_@astro":"chunks/index_BaHb9ime.mjs","\u0000virtual:astro:page:src/pages/api/admin/wizard/generate@_@ts":"chunks/generate_Ngp_48_n.mjs","\u0000virtual:astro:page:src/pages/api/ai-mentor/chat@_@ts":"chunks/chat_mX9ni_ir.mjs","\u0000virtual:astro:page:src/pages/api/newsletter@_@ts":"chunks/newsletter_GYZrm8Ev.mjs","\u0000virtual:astro:page:src/pages/api/payos/check-access@_@ts":"chunks/check-access_cbzizGhA.mjs","\u0000virtual:astro:page:src/pages/book/index@_@astro":"chunks/index_ClXxVYI9.mjs","\u0000virtual:astro:page:src/pages/courses/index@_@astro":"chunks/index_C78-VoJo.mjs","\u0000virtual:astro:page:src/pages/my-questions/[id]@_@astro":"chunks/_id__CdQSUE96.mjs","\u0000virtual:astro:page:src/pages/reviews@_@astro":"chunks/reviews_DDyLUWl6.mjs","\u0000virtual:astro:page:src/pages/scanner/result/[id]@_@astro":"chunks/_id__BL4K-cq_.mjs","\u0000virtual:astro:page:src/pages/admin/ebooks/[id]@_@astro":"chunks/_id__GjeFjDIO.mjs","\u0000virtual:astro:page:src/pages/app/[slug]@_@astro":"chunks/_slug__CmFJb_NP.mjs","\u0000virtual:astro:page:src/pages/courses/[id]@_@astro":"chunks/_id__Blw68nmq.mjs","\u0000virtual:astro:page:src/pages/scanner/[slug]@_@astro":"chunks/_slug__BC__0u4m.mjs","\u0000virtual:astro:page:src/pages/blog/[slug]@_@astro":"chunks/_slug__CHO1ChbC.mjs","\u0000virtual:astro:page:src/pages/book/[...slug]@_@astro":"chunks/_.._DC_wlX1e.mjs","\u0000virtual:astro:page:src/pages/rss.xml@_@ts":"chunks/rss_u-qqBgcH.mjs","\u0000virtual:astro:page:src/pages/api/scanner/[id]/pdf@_@ts":"chunks/pdf_BxXfFwgZ.mjs","C:/dentalempireos/src/components/admin/Sidebar.astro?astro&type=script&index=0&lang.ts":"_astro/Sidebar.astro_astro_type_script_index_0_lang.BxgrY7Rt.js","C:/dentalempireos/src/components/blog/BlogSectionNav.astro?astro&type=script&index=0&lang.ts":"_astro/BlogSectionNav.astro_astro_type_script_index_0_lang.Ca77SS-F.js","C:/dentalempireos/src/components/book/BookHeader.astro?astro&type=script&index=0&lang.ts":"_astro/BookHeader.astro_astro_type_script_index_0_lang.DfLbz6tH.js","C:/dentalempireos/src/components/book/DonateWidget.astro?astro&type=script&index=0&lang.ts":"_astro/DonateWidget.astro_astro_type_script_index_0_lang.CNq9h75S.js","C:/dentalempireos/src/components/book/QuestionDrawer.astro?astro&type=script&index=0&lang.ts":"_astro/QuestionDrawer.astro_astro_type_script_index_0_lang.-rAgYc81.js","C:/dentalempireos/src/components/book/ReviewDrawer.astro?astro&type=script&index=0&lang.ts":"_astro/ReviewDrawer.astro_astro_type_script_index_0_lang.BqGmdET1.js","C:/dentalempireos/src/components/book/ReviewForm.astro?astro&type=script&index=0&lang.ts":"_astro/ReviewForm.astro_astro_type_script_index_0_lang.CmYk3Bb_.js","C:/dentalempireos/src/components/book/SectionNav.astro?astro&type=script&index=0&lang.ts":"_astro/SectionNav.astro_astro_type_script_index_0_lang.W4wfUr5i.js","C:/dentalempireos/src/components/book/SectionNavMobile.astro?astro&type=script&index=0&lang.ts":"_astro/SectionNavMobile.astro_astro_type_script_index_0_lang.Cnhovecy.js","C:/dentalempireos/src/components/layout/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.Cdz8YgKY.js","C:/dentalempireos/src/components/layout/NotificationBell.astro?astro&type=script&index=0&lang.ts":"_astro/NotificationBell.astro_astro_type_script_index_0_lang.CZHNE95F.js","C:/dentalempireos/src/components/mobile/MobileBottomNav.astro?astro&type=script&index=0&lang.ts":"_astro/MobileBottomNav.astro_astro_type_script_index_0_lang.CCSiUUQ7.js","C:/dentalempireos/src/components/mobile/PwaInstallPrompt.astro?astro&type=script&index=0&lang.ts":"_astro/PwaInstallPrompt.astro_astro_type_script_index_0_lang.By3OfS0X.js","C:/dentalempireos/src/components/questions/QuestionThread.astro?astro&type=script&index=0&lang.ts":"_astro/QuestionThread.astro_astro_type_script_index_0_lang.ZS7GhZzj.js","C:/dentalempireos/src/layouts/BookLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BookLayout.astro_astro_type_script_index_0_lang.BonaMplx.js","C:/dentalempireos/src/layouts/BookLayout.astro?astro&type=script&index=1&lang.ts":"_astro/BookLayout.astro_astro_type_script_index_1_lang.d-cei8x7.js","C:/dentalempireos/src/layouts/BookLayout.astro?astro&type=script&index=2&lang.ts":"_astro/BookLayout.astro_astro_type_script_index_2_lang.BR3pTUll.js","C:/dentalempireos/src/pages/account/clinic.astro?astro&type=script&index=0&lang.ts":"_astro/clinic.astro_astro_type_script_index_0_lang.ck_5zumI.js","C:/dentalempireos/src/pages/account/profile.astro?astro&type=script&index=0&lang.ts":"_astro/profile.astro_astro_type_script_index_0_lang.cMt1XRzK.js","C:/dentalempireos/src/pages/admin/ai-settings.astro?astro&type=script&index=0&lang.ts":"_astro/ai-settings.astro_astro_type_script_index_0_lang.DZvPGkiY.js","C:/dentalempireos/src/pages/admin/apps/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BtQDBXcS.js","C:/dentalempireos/src/pages/admin/apps/wizard.astro?astro&type=script&index=0&lang.ts":"_astro/wizard.astro_astro_type_script_index_0_lang.CpgpKT_2.js","C:/dentalempireos/src/pages/admin/blog/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.DYIYJMXG.js","C:/dentalempireos/src/pages/admin/blog/categories.astro?astro&type=script&index=0&lang.ts":"_astro/categories.astro_astro_type_script_index_0_lang.BybIhyEE.js","C:/dentalempireos/src/pages/admin/blog/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.DLoXiUpZ.js","C:/dentalempireos/src/pages/admin/blog/new.astro?astro&type=script&index=0&lang.ts":"_astro/new.astro_astro_type_script_index_0_lang.D8tUllKj.js","C:/dentalempireos/src/pages/admin/blog/tags.astro?astro&type=script&index=0&lang.ts":"_astro/tags.astro_astro_type_script_index_0_lang.M7ydo1jC.js","C:/dentalempireos/src/pages/admin/courses/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.DjDHqgqP.js","C:/dentalempireos/src/pages/admin/courses/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.DLndf3ow.js","C:/dentalempireos/src/pages/admin/ebooks/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.vLtdPOsr.js","C:/dentalempireos/src/pages/admin/ebooks/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.Bve3rrmF.js","C:/dentalempireos/src/pages/admin/ebooks/new.astro?astro&type=script&index=0&lang.ts":"_astro/new.astro_astro_type_script_index_0_lang.CtpoEb3T.js","C:/dentalempireos/src/pages/admin/homepage.astro?astro&type=script&index=0&lang.ts":"_astro/homepage.astro_astro_type_script_index_0_lang.B2ehEjsJ.js","C:/dentalempireos/src/pages/admin/resources/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.CDLfvTus.js","C:/dentalempireos/src/pages/admin/scanners/[id]/response/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.BWyoBtL0.js","C:/dentalempireos/src/pages/admin/scanners/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BCShhNEg.js","C:/dentalempireos/src/pages/admin/settings/payos.astro?astro&type=script&index=0&lang.ts":"_astro/payos.astro_astro_type_script_index_0_lang.DOFPadav.js","C:/dentalempireos/src/pages/admin/settings/support.astro?astro&type=script&index=0&lang.ts":"_astro/support.astro_astro_type_script_index_0_lang.b50-aKmb.js","C:/dentalempireos/src/pages/admin/users/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.DhhDr8-V.js","C:/dentalempireos/src/pages/ai-mentor/[slug].astro?astro&type=script&index=0&lang.ts":"_astro/_slug_.astro_astro_type_script_index_0_lang.CgBbGDv-.js","C:/dentalempireos/src/pages/blog/[slug].astro?astro&type=script&index=0&lang.ts":"_astro/_slug_.astro_astro_type_script_index_0_lang.UN3SviI2.js","C:/dentalempireos/src/pages/blog/category/[category]/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.279BDiR1.js","C:/dentalempireos/src/pages/blog/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.C5SGml3n.js","C:/dentalempireos/src/pages/book/[...slug].astro?astro&type=script&index=0&lang.ts":"_astro/_...slug_.astro_astro_type_script_index_0_lang.BgaxD4HN.js","C:/dentalempireos/src/pages/courses/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.C5DT4tH4.js","C:/dentalempireos/src/pages/login.astro?astro&type=script&index=0&lang.ts":"_astro/login.astro_astro_type_script_index_0_lang.Bogv1o0v.js","C:/dentalempireos/src/pages/register.astro?astro&type=script&index=0&lang.ts":"_astro/register.astro_astro_type_script_index_0_lang.DW7Ki85_.js","C:/dentalempireos/src/pages/resources/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.DOnxRkDg.js","C:/dentalempireos/src/pages/reviews.astro?astro&type=script&index=0&lang.ts":"_astro/reviews.astro_astro_type_script_index_0_lang.bLid5Jkg.js","C:/dentalempireos/src/pages/scanner/pack.astro?astro&type=script&index=0&lang.ts":"_astro/pack.astro_astro_type_script_index_0_lang.j8732SiQ.js","C:/dentalempireos/src/pages/scanner/result/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.PVWiHg_Q.js","C:/dentalempireos/src/scripts/richtext-toolbar.ts":"_astro/richtext-toolbar.Dgvo_ADY.js","astro:scripts/page.js":"_astro/page.B9eF5IcF.js","C:/dentalempireos/src/scripts/richtext-editor.ts":"_astro/richtext-editor.CyqJ8vxG.js","C:/dentalempireos/src/pages/admin/scanners/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.BSkcB8m_.js","C:/dentalempireos/src/pages/admin/scanners/ho-so-goc-re.astro?astro&type=script&index=0&lang.ts":"_astro/ho-so-goc-re.astro_astro_type_script_index_0_lang.HqKWo_6E.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/dentalempireos/src/components/blog/BlogSectionNav.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};(function(){function g(){const h=document.getElementById(\"blog-section-nav-trigger\"),l=document.getElementById(\"blog-section-nav-overlay\"),m=document.getElementById(\"blog-section-nav-sheet\"),L=document.getElementById(\"blog-section-nav-handle\"),S=document.getElementById(\"blog-section-nav-close\"),f=document.querySelectorAll(\"[data-blog-section-link]\"),v=document.getElementById(\"blog-section-nav-progress\");if(!h||!m)return;const o=m;function I(){const e=document.querySelector(\"[data-blog-section-link].blog-section-active\");if(e)return e.dataset.blogSectionLink??null;const n=document.getElementById(\"article-content\");if(!n)return null;const t=n.querySelectorAll(\"h2[id], h3[id]\");if(!t.length)return null;let s=null,i=1/0;return t.forEach(a=>{const u=a.getBoundingClientRect(),p=Math.abs(u.top-80);p<i&&(i=p,s=a.id)}),s}function B(){o.classList.add(\"blog-section-open\"),document.body.classList.add(\"blog-toc-open\"),l&&l.classList.remove(\"hidden\");const e=I();e&&f.forEach(n=>{const t=n.dataset.blogSectionLink===e;n.classList.toggle(\"blog-section-active\",t),t&&setTimeout(()=>n.scrollIntoView({behavior:\"smooth\",block:\"nearest\"}),100)}),b()}function c(){o.classList.remove(\"blog-section-open\"),document.body.classList.remove(\"blog-toc-open\"),l&&l.classList.add(\"hidden\")}function b(){if(!v)return;const e=document.scrollingElement;if(!e)return;const n=e.scrollHeight-e.clientHeight,t=n>0?Math.min(100,Math.round(e.scrollTop/n*100)):0;v.style.width=`${t}%`}const E=document.getElementById(\"article-content\");if(E){const e=[];E.querySelectorAll(\"h2[id], h3[id]\").forEach(t=>{e.push(t)});const n=new IntersectionObserver(t=>{t.forEach(s=>{const i=s.target.id,a=document.querySelector(`[data-blog-section-link=\"${i}\"]`);a&&s.isIntersecting&&(document.querySelectorAll(\"[data-blog-section-link]\").forEach(u=>u.classList.remove(\"blog-section-active\")),a.classList.add(\"blog-section-active\"))})},{rootMargin:\"-15% 0px -75% 0px\"});e.forEach(t=>n.observe(t))}window.addEventListener(\"scroll\",b,{passive:!0}),h.addEventListener(\"click\",()=>{o.classList.contains(\"blog-section-open\")?c():B()}),l?.addEventListener(\"click\",c),S?.addEventListener(\"click\",c),f.forEach(e=>{e.addEventListener(\"click\",n=>{n.preventDefault();const t=e.getAttribute(\"href\");if(t&&t!==\"#\"){const s=document.getElementById(t.slice(1));if(s){const i=s.getBoundingClientRect().top+window.scrollY-80;window.scrollTo({top:i,behavior:\"smooth\"})}history.replaceState(null,\"\",t)}c()})});let y=0,r=0,d=!1;L?.addEventListener(\"touchstart\",e=>{y=e.touches[0].clientY,d=!0,o.style.transition=\"none\"},{passive:!0}),document.addEventListener(\"touchmove\",e=>{d&&(r=e.touches[0].clientY-y,r>0&&(o.style.transform=`translateY(${r}px)`))},{passive:!0}),document.addEventListener(\"touchend\",()=>{d&&(d=!1,o.style.transition=\"\",r>80&&c(),o.style.transform=\"\",r=0)}),document.addEventListener(\"keydown\",e=>{e.key===\"Escape\"&&o.classList.contains(\"blog-section-open\")&&c()})}document.readyState===\"loading\"?document.addEventListener(\"DOMContentLoaded\",g):g()})();"],["C:/dentalempireos/src/components/book/BookHeader.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};(function(){const t=document.querySelector(\".reader-content\");if(!t)return;const n=(t.textContent||\"\").trim().split(/\\s+/).filter(Boolean).length,o=Math.max(1,Math.round(n/120)),e=document.getElementById(\"read-time-remaining\");e&&(e.textContent=`~${o} phút đọc`)})();"],["C:/dentalempireos/src/components/book/DonateWidget.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.querySelectorAll(\".donate-download-btn\").forEach(e=>{e.addEventListener(\"click\",async()=>{const r=e.getAttribute(\"data-donate-qr-url\");if(!r)return;const t=e.querySelector(\".donate-download-label\");try{e.setAttribute(\"disabled\",\"\"),t&&(t.textContent=\"Đang tải...\");const i=await(await fetch(r)).blob(),l=r.split(\".\").pop()?.split(\"?\")[0]||\"png\",d=URL.createObjectURL(i),s=document.createElement(\"a\");s.href=d,s.download=`dental-empire-qr.${l}`,s.click(),URL.revokeObjectURL(d),t&&(t.textContent=\"Đã lưu!\"),setTimeout(()=>{t&&(t.textContent=\"Lưu hình QR\")},2e3)}catch{window.open(r,\"_blank\"),t&&(t.textContent=\"Lưu hình QR\")}finally{e.removeAttribute(\"disabled\")}})});const n=document.getElementById(\"support-trigger\"),a=document.getElementById(\"support-panel\"),o=document.getElementById(\"support-chevron\");n&&a&&o&&(n.addEventListener(\"click\",()=>{n.getAttribute(\"aria-expanded\")===\"true\"?(a.classList.add(\"hidden\"),n.setAttribute(\"aria-expanded\",\"false\"),o.style.transform=\"\"):(a.classList.remove(\"hidden\"),n.setAttribute(\"aria-expanded\",\"true\"),o.style.transform=\"rotate(180deg)\",a.scrollIntoView({behavior:\"smooth\",block:\"nearest\"}))}),document.addEventListener(\"keydown\",e=>{e.key===\"Escape\"&&n.getAttribute(\"aria-expanded\")===\"true\"&&(a.classList.add(\"hidden\"),n.setAttribute(\"aria-expanded\",\"false\"),o.style.transform=\"\")}));"],["C:/dentalempireos/src/components/book/QuestionDrawer.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};(function(){const r=document.getElementById(\"question-trigger\"),e=document.getElementById(\"question-drawer-mobile\"),h=document.getElementById(\"question-close-mobile\"),p=document.getElementById(\"question-handle\");let n=!1;async function g(){try{const s=await fetch(\"/api/notifications/unread-count\",{credentials:\"include\"});r?.classList.toggle(\"hidden\",!s.ok)}catch{r?.classList.remove(\"hidden\")}}g();function b(){e&&(n=!0,e.classList.remove(\"hidden\"),requestAnimationFrame(()=>{e.style.opacity=\"1\",e.style.pointerEvents=\"auto\",e.style.transform=\"translateY(0)\"}))}function i(){e&&(n=!1,e.style.opacity=\"0\",e.style.pointerEvents=\"none\",e.style.transform=\"translateY(100%)\",setTimeout(()=>e.classList.add(\"hidden\"),350))}r?.addEventListener(\"click\",()=>n?i():b()),h?.addEventListener(\"click\",i),document.addEventListener(\"keydown\",s=>{s.key===\"Escape\"&&n&&i()});const a=document.getElementById(\"question-form-mobile\"),t=document.getElementById(\"question-submit-mobile\"),c=document.getElementById(\"question-success-mobile\");a?.addEventListener(\"submit\",async s=>{s.preventDefault();const d=new FormData(a),m=d.get(\"title\")?.trim(),f=d.get(\"body\")?.trim(),v=d.get(\"chapter_id\");if(!(!m||!f)){t&&(t.disabled=!0,t.innerHTML='<span class=\"material-symbols-outlined text-base\" style=\"animation:spin 1s linear infinite\">progress_activity</span> Đang gửi...');try{const y=await fetch(\"/api/questions\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},credentials:\"include\",body:JSON.stringify({chapter_id:v,title:m,body:f})});if(!y.ok){if(y.status===401){window.location.href=\"/login\";return}alert(\"Có lỗi xảy ra, vui lòng thử lại.\"),t&&(t.disabled=!1,t.innerHTML='<span class=\"material-symbols-outlined text-base\">send</span> Gửi câu hỏi');return}a.classList.add(\"hidden\"),c?.classList.remove(\"hidden\"),setTimeout(()=>{a.reset(),a.classList.remove(\"hidden\"),c?.classList.add(\"hidden\"),t&&(t.disabled=!1,t.innerHTML='<span class=\"material-symbols-outlined text-base\">send</span> Gửi câu hỏi')},2500)}catch{alert(\"Lỗi kết nối. Vui lòng thử lại.\"),t&&(t.disabled=!1,t.innerHTML='<span class=\"material-symbols-outlined text-base\">send</span> Gửi câu hỏi')}}});let u=0,o=0,l=!1;p?.addEventListener(\"touchstart\",s=>{u=s.touches[0].clientY,l=!0,e&&(e.style.transition=\"none\")},{passive:!0}),document.addEventListener(\"touchmove\",s=>{l&&(o=s.touches[0].clientY-u,o>0&&e&&(e.style.transform=`translateY(${o}px)`))},{passive:!0}),document.addEventListener(\"touchend\",()=>{l&&(l=!1,e&&(e.style.transition=\"\"),o>80?i():e&&(e.style.transform=n?\"translateY(0)\":\"translateY(100%)\"),o=0)}),window.addEventListener(\"resize\",()=>{n&&i()})})();"],["C:/dentalempireos/src/components/book/ReviewForm.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.querySelectorAll(\"#review-form\").forEach(n=>{n.addEventListener(\"submit\",async c=>{c.preventDefault();const s=new FormData(n),i=n.closest(\".review-form-container\"),e=i?.querySelector(\".review-status\"),t=i?.querySelector(\".review-submit\"),a=s.get(\"rating\");if(!a){e&&(e.textContent=\"Vui lòng chọn số sao\");return}const l={chapter_id:s.get(\"chapter_id\"),rating:parseInt(a),title:s.get(\"title\")||void 0,content:s.get(\"content\"),author_name:s.get(\"author_name\")||void 0};t.disabled=!0,t.innerHTML='<span class=\"material-symbols-outlined text-[18px] animate-spin\">progress_activity</span> Đang gửi...';try{const o=await fetch(\"/api/public/reviews\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(l)});if(o.ok)n.classList.add(\"hidden\"),i?.querySelector(\".review-success\")?.classList.remove(\"hidden\"),setTimeout(()=>window.location.reload(),1500);else{const r=await o.json();e&&(e.textContent=r.error||\"Có lỗi xảy ra\"),t.disabled=!1,t.innerHTML='<span class=\"material-symbols-outlined text-[18px]\">send</span> Gửi đánh giá'}}catch{e&&(e.textContent=\"Không thể kết nối server\"),t.disabled=!1,t.innerHTML='<span class=\"material-symbols-outlined text-[18px]\">send</span> Gửi đánh giá'}})});"],["C:/dentalempireos/src/components/book/SectionNav.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};(function(){function l(){const i=document.getElementById(\"reader-scroll\");if(!i)return;const s=document.querySelectorAll(\"[data-section-link]\"),a=document.querySelectorAll(\".reader-content h2[id], .reader-content h3[id]\");if(a.length>0&&s.length>0){let n=null;const r=new IntersectionObserver(e=>{const c=e.filter(t=>t.isIntersecting).sort((t,o)=>Math.abs(t.boundingClientRect.top)-Math.abs(o.boundingClientRect.top));if(c.length>0){const t=c[0].target.id;t!==n&&(n=t,s.forEach(o=>{const d=o.dataset.sectionLink===t;if(o.classList.toggle(\"section-nav-active\",d),d){const g=document.getElementById(\"section-nav-links\");if(g){const h=o.getBoundingClientRect(),u=g.getBoundingClientRect();(h.top<u.top+40||h.bottom>u.bottom-20)&&o.scrollIntoView({behavior:\"smooth\",block:\"nearest\"})}}}))}},{rootMargin:\"-80px 0px -60% 0px\",threshold:0});a.forEach(e=>r.observe(e))}s.forEach(n=>{n.addEventListener(\"click\",r=>{r.preventDefault();const e=n.getAttribute(\"href\");if(e&&e!==\"#\"){const c=document.getElementById(e.slice(1));if(c){const t=c.getBoundingClientRect().top+i.scrollTop-80;i.scrollTo({top:t,behavior:\"smooth\"})}else i.scrollTo({top:0,behavior:\"smooth\"});history.replaceState(null,\"\",e)}})})}document.readyState===\"loading\"?document.addEventListener(\"DOMContentLoaded\",l):l()})();"],["C:/dentalempireos/src/components/layout/NotificationBell.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};async function m(){try{const t=await fetch(\"/api/notifications/unread-count\",{credentials:\"include\"});return t.ok?(await t.json()).count??0:0}catch{return 0}}function d(t){const n=document.getElementById(\"notif-badge\");n&&(t>0?(n.textContent=t>99?\"99+\":String(t),n.classList.remove(\"hidden\")):n.classList.add(\"hidden\"))}async function c(){try{const t=await fetch(\"/api/notifications\",{credentials:\"include\"});return t.ok?await t.json():[]}catch{return[]}}function l(t,n){const i=document.getElementById(n);if(i){if(!t.length){i.innerHTML=`\n        <div class=\"p-6 text-center text-sm text-on-surface-variant/50\">\n          <span class=\"material-symbols-outlined text-3xl block mb-2 opacity-50\">notifications_none</span>\n          Chưa có thông báo\n        </div>`;return}i.innerHTML=t.map(e=>`\n      <a\n        href=\"${e.link||\"#\"}\"\n        data-notif-id=\"${e.id}\"\n        data-notif-read=\"${e.read?\"1\":\"0\"}\"\n        class=\"notif-item flex items-start gap-3 px-4 py-2.5 hover:bg-surface-container transition-colors ${e.read?\"\":\"bg-primary/5\"}\"\n      >\n        <div class=\"w-8 h-8 rounded-full ${e.read?\"bg-surface-container-high\":\"bg-primary/15\"} flex items-center justify-center shrink-0 mt-0.5\">\n          <span class=\"material-symbols-outlined text-sm ${e.read?\"text-on-surface-variant\":\"text-primary\"}\">chat</span>\n        </div>\n        <div class=\"flex-1 min-w-0\">\n          <div class=\"flex items-baseline gap-2\">\n            <p class=\"text-xs font-bold ${e.read?\"text-on-surface-variant\":\"text-white\"} leading-snug truncate\">${e.title}</p>\n            <span class=\"text-[10px] text-on-surface-variant/40 shrink-0\">${new Date(e.createdAt).toLocaleDateString(\"vi-VN\")}</span>\n          </div>\n          <p class=\"text-[11px] text-on-surface-variant/60 mt-0.5 line-clamp-2\">${e.body}</p>\n        </div>\n        ${e.read?\"\":'<div class=\"w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5\"></div>'}\n      </a>\n    `).join(\"\"),i.querySelectorAll('.notif-item[data-notif-read=\"0\"]').forEach(e=>{e.addEventListener(\"click\",async p=>{const s=e.getAttribute(\"data-notif-id\");if(p.preventDefault(),s)try{await fetch(\"/api/notifications/read\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},credentials:\"include\",body:JSON.stringify({id:s})});const a=document.getElementById(\"notif-badge\");if(a&&!a.classList.contains(\"hidden\")){const r=parseInt(a.textContent||\"0\")-1;r<=0?a.classList.add(\"hidden\"):a.textContent=String(r)}e.setAttribute(\"data-notif-read\",\"1\"),e.classList.remove(\"bg-primary/5\"),e.querySelector(\".rounded-full.bg-primary\")?.remove()}catch{}const o=e.getAttribute(\"href\");o&&o!==\"#\"&&setTimeout(()=>{window.location.href=o},50)})})}}async function g(t,n){const i=document.getElementById(t);if(!i)return;i.classList.remove(\"hidden\");const e=await c();l(e,n)}function f(t){document.getElementById(t)?.classList.add(\"hidden\")}document.getElementById(\"notif-bell-btn\")?.addEventListener(\"click\",t=>{t.stopPropagation(),document.getElementById(\"notif-dropdown\")?.classList.contains(\"hidden\")?g(\"notif-dropdown\",\"notif-list\"):f(\"notif-dropdown\")});document.addEventListener(\"click\",t=>{const n=t.target;!n.closest(\"#notif-dropdown\")&&!n.closest(\"#notif-bell-btn\")&&f(\"notif-dropdown\")});async function h(){await fetch(\"/api/notifications/read\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},credentials:\"include\",body:JSON.stringify({})}),d(0);const t=await c();l(t,\"notif-list\")}document.getElementById(\"notif-mark-all\")?.addEventListener(\"click\",h);async function u(){const t=await m();d(t)}u();setInterval(u,3e4);"],["C:/dentalempireos/src/components/mobile/PwaInstallPrompt.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};(function(){var t=document.getElementById(\"pwa-install-prompt\");if(!t||window.matchMedia(\"(min-width: 1024px)\").matches)return;var L=window.matchMedia(\"(display-mode: standalone)\").matches||window.matchMedia(\"(display-mode: fullscreen)\").matches||window.navigator.standalone===!0;if(L)return;var c=\"pwa-install-dismissed-at\";try{var l=parseInt(localStorage.getItem(c)||\"0\",10);if(l&&Date.now()-l<10080*60*1e3)return}catch{}var E=navigator.userAgent,m=/iPad|iPhone|iPod/.test(E)&&!window.MSStream,u=m?\"ios\":\"android\";function v(){t.querySelectorAll(\"[data-variant]\").forEach(function(a){a.classList.add(\"hidden\")});var e=t.querySelector('[data-variant=\"'+u+'\"]');if(e&&e.classList.remove(\"hidden\"),u===\"android\"&&window.__deferredPrompt){var o=document.getElementById(\"android-collapsed\"),y=document.getElementById(\"android-expanded\");o&&o.classList.add(\"hidden\"),y&&y.classList.remove(\"hidden\");var s=document.getElementById(\"pwa-expand-btn\");s&&(s.textContent=\"Cài đặt\",s.onclick=async function(){var a=window.__deferredPrompt;if(!a){i();return}a.prompt();var b=await a.userChoice;b?.outcome===\"accepted\"&&i(),window.__deferredPrompt=null})}t.classList.remove(\"hidden\"),t.classList.add(\"is-visible\")}function i(){t.classList.remove(\"is-visible\"),setTimeout(function(){t.classList.add(\"hidden\")},300);try{localStorage.setItem(c,String(Date.now()))}catch{}}t.querySelectorAll('[id^=\"pwa-install-close\"]').forEach(function(e){e.onclick=function(){i()}});var f=document.getElementById(\"pwa-expand-btn\"),p=document.getElementById(\"pwa-collapse-btn\"),h=document.getElementById(\"android-collapsed\"),w=document.getElementById(\"android-expanded\");f&&f.addEventListener(\"click\",function(){h?.classList.add(\"hidden\"),w?.classList.remove(\"hidden\")}),p&&p.addEventListener(\"click\",function(){w?.classList.add(\"hidden\"),h?.classList.remove(\"hidden\")});var I=document.getElementById(\"pwa-email-submit\"),d=document.getElementById(\"pwa-email-input\"),n=document.getElementById(\"pwa-email-msg\");if(I?.addEventListener(\"click\",async function(){if(!(!d||!n)){var e=d.value.trim();if(!e||!e.includes(\"@\")){n.textContent=\"⚠️ Vui lòng nhập đúng email\",n.classList.remove(\"hidden\",\"text-green-400\"),n.classList.add(\"text-red-400\");return}try{await fetch(\"/api/subscribe\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:e})})}catch{}n.textContent=\"✅ Cảm ơn bạn! Mình sẽ báo khi có ebook mới.\",n.classList.remove(\"hidden\",\"text-red-400\"),n.classList.add(\"text-green-400\"),d.value=\"\"}}),m){setTimeout(v,4e3);return}var r=!1;function g(){r||(r=!0,v())}window.addEventListener(\"beforeinstallprompt\",function(e){e.preventDefault(),window.__deferredPrompt=e,setTimeout(g,1e3)}),setTimeout(function(){r||g()},8e3)})();"],["C:/dentalempireos/src/components/questions/QuestionThread.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.querySelectorAll(\".reply-submit-btn\").forEach(r=>{r.addEventListener(\"click\",async n=>{n.preventDefault();const s=r.dataset.questionId,o=document.getElementById(`reply-body-${s}`)?.value?.trim();if(!o||!s)return;const t=r;t.disabled=!0,t.textContent=\"Đang gửi...\";try{const e=await fetch(`/api/questions/${s}/reply`,{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},credentials:\"include\",body:JSON.stringify({body:o})});if(!e.ok){const a=(await e.json().catch(()=>({}))).error||`HTTP ${e.status}`;showToast(`Gửi thất bại: ${a}`,\"error\");return}window.location.reload()}catch(e){console.error(\"[reply] fetch error:\",e),showToast(\"Lỗi kết nối. Vui lòng thử lại.\",\"error\")}finally{t.disabled=!1,t.innerHTML='<span class=\"material-symbols-outlined text-base\">send</span> Gửi'}})});"],["C:/dentalempireos/src/pages/admin/apps/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const n=document.getElementById(\"create-modal\"),c=document.getElementById(\"create-modal-backdrop\"),i=document.getElementById(\"create-modal-panel\");function m(){n.classList.remove(\"hidden\"),n.classList.add(\"flex\"),n.offsetHeight,c.classList.replace(\"bg-black/0\",\"bg-black/60\"),c.classList.replace(\"backdrop-blur-none\",\"backdrop-blur-sm\"),i.classList.replace(\"scale-95\",\"scale-100\"),i.classList.replace(\"opacity-0\",\"opacity-100\")}function r(){c.classList.replace(\"bg-black/60\",\"bg-black/0\"),c.classList.replace(\"backdrop-blur-sm\",\"backdrop-blur-none\"),i.classList.replace(\"scale-100\",\"scale-95\"),i.classList.replace(\"opacity-100\",\"opacity-0\"),setTimeout(()=>{n.classList.add(\"hidden\"),n.classList.remove(\"flex\")},300)}document.getElementById(\"open-create-modal\")?.addEventListener(\"click\",m);document.getElementById(\"open-create-modal-empty\")?.addEventListener(\"click\",m);document.getElementById(\"close-create-modal\")?.addEventListener(\"click\",r);document.getElementById(\"close-create-modal-2\")?.addEventListener(\"click\",r);c?.addEventListener(\"click\",r);function o(e,s=\"info\"){typeof window<\"u\"&&window.showToast?window.showToast(e,s):alert(e)}document.getElementById(\"create-form\")?.addEventListener(\"submit\",async e=>{e.preventDefault();const s=e.target,t=document.getElementById(\"submit-create\"),a=new FormData(s);t.disabled=!0,t.innerHTML='<span class=\"material-symbols-outlined text-[18px] animate-spin\">progress_activity</span> Đang tạo...';const p={name:a.get(\"name\")?.toString().trim(),slug:a.get(\"slug\")?.toString().trim()||void 0,type:a.get(\"type\")?.toString(),description:a.get(\"description\")?.toString().trim()||null,status:a.get(\"status\")?.toString()||\"draft\",is_free:a.has(\"is_free\")?1:0};try{const l=await fetch(\"/api/admin/apps\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(p)});if(l.ok){const{id:d}=await l.json();o(\"Tạo ứng dụng thành công!\",\"success\"),setTimeout(()=>{window.location.href=`/admin/apps/${d}`},600)}else{const d=await l.json().catch(()=>({error:\"Lỗi không xác định\"}));o(d.error||\"Tạo ứng dụng thất bại\",\"error\"),t.disabled=!1,t.innerHTML='<span class=\"material-symbols-outlined text-[18px]\">add</span> Tạo mới'}}catch{o(\"Lỗi kết nối. Vui lòng thử lại.\",\"error\"),t.disabled=!1,t.innerHTML='<span class=\"material-symbols-outlined text-[18px]\">add</span> Tạo mới'}});document.querySelectorAll(\".delete-btn\").forEach(e=>{e.addEventListener(\"click\",async()=>{const s=e.dataset.id,t=e.dataset.name;if(!s||!confirm(`Xác nhận xóa ứng dụng \"${t}\"?`))return;(await fetch(`/api/admin/apps/${s}`,{method:\"DELETE\"})).ok?(o(`Đã xóa \"${t}\"`,\"success\"),setTimeout(()=>window.location.reload(),600)):o(\"Xóa thất bại\",\"error\")})});"],["C:/dentalempireos/src/pages/admin/blog/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.getElementById(\"cat-filter\")?.addEventListener(\"change\",e=>{const t=e.target.value,a=new URL(window.location.href);t?a.searchParams.set(\"cat\",t):a.searchParams.delete(\"cat\"),window.location.href=a.toString()});document.querySelectorAll(\"[data-delete-post]\").forEach(e=>{e.addEventListener(\"click\",async()=>{const t=e.dataset.deletePost;if(!confirm(\"Xóa bài viết này?\"))return;(await fetch(`/api/admin/blog/${t}`,{method:\"DELETE\"})).ok?e.closest(\"tr\")?.remove():showToast(\"Xóa thất bại\",\"error\")})});"],["C:/dentalempireos/src/pages/admin/blog/tags.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const t=document.getElementById(\"tag-name\"),e=document.getElementById(\"tag-slug\");document.getElementById(\"new-id\");t?.addEventListener(\"input\",()=>{e.dataset.manual||(e.value=t.value.toLowerCase().normalize(\"NFD\").replace(/[̀-ͯ]/g,\"\").replace(/[^a-z0-9\\s-]/g,\"\").replace(/\\s+/g,\"-\").replace(/-+/g,\"-\").replace(/^-|-$/g,\"\"))});e?.addEventListener(\"input\",()=>{e.dataset.manual=\"true\"});"],["C:/dentalempireos/src/pages/admin/courses/[id].astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.getElementById(\"course-form\")?.addEventListener(\"submit\",async e=>{e.preventDefault();const n=e.target,s=new FormData(n),t=Object.fromEntries(s.entries());t.is_published=t.is_published?1:0,t.sort_order=parseInt(t.sort_order)||0;const d=t.id;if(delete t.id,(await fetch(`/api/admin/courses/${d}`,{method:\"PUT\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({...t,id:d})})).ok){const o=e.target.querySelector('button[type=\"submit\"]'),i=o.innerHTML;o.innerHTML='<span class=\"material-symbols-outlined text-[18px]\">check</span> Đã lưu!',o.classList.add(\"text-green-400\"),setTimeout(()=>{o.innerHTML=i,o.classList.remove(\"text-green-400\")},2e3)}else showToast(\"Lỗi khi lưu\",\"error\")});document.getElementById(\"btn-add-video\")?.addEventListener(\"click\",()=>{document.getElementById(\"add-video-form\")?.classList.toggle(\"hidden\")});document.getElementById(\"btn-cancel-video\")?.addEventListener(\"click\",()=>{document.getElementById(\"add-video-form\")?.classList.add(\"hidden\")});document.getElementById(\"btn-save-video\")?.addEventListener(\"click\",async()=>{const e=document.getElementById(\"video-id\").value,n=document.getElementById(\"video-youtube-id\").value.trim(),s=document.getElementById(\"video-title\").value.trim(),t=document.getElementById(\"video-description\").value.trim(),d=parseInt(document.getElementById(\"video-sort-order\").value)||0,r=parseInt(document.getElementById(\"video-duration\").value)||null;if(!n||!s){showToast(\"YouTube ID và tiêu đề là bắt buộc\",\"error\");return}const o=document.querySelector('[name=\"id\"]').value,i=await fetch(`/api/admin/courses/${o}/videos`,{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({id:e,youtube_id:n,title:s,description:t||null,sort_order:d,duration_seconds:r,is_published:1})});if(i.ok)window.location.reload();else{const a=await i.json();showToast(\"Lỗi: \"+(a.error??\"Không rõ\"),\"error\")}});document.querySelectorAll(\"[data-delete-video]\").forEach(e=>{e.addEventListener(\"click\",async()=>{const n=e.dataset.deleteVideo;if(!confirm(\"Xóa video này?\"))return;(await fetch(`/api/admin/courses/videos/${n}`,{method:\"DELETE\"})).ok?e.closest(\".video-row\")?.remove():showToast(\"Xóa thất bại\",\"error\")})});"],["C:/dentalempireos/src/pages/admin/courses/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};function c(){document.getElementById(\"new-course-modal\")?.classList.remove(\"hidden\")}function n(){document.getElementById(\"new-course-modal\")?.classList.add(\"hidden\")}document.getElementById(\"btn-new-course\")?.addEventListener(\"click\",c);document.getElementById(\"btn-new-empty\")?.addEventListener(\"click\",c);document.getElementById(\"modal-close\")?.addEventListener(\"click\",n);document.getElementById(\"modal-cancel\")?.addEventListener(\"click\",n);document.getElementById(\"modal-backdrop\")?.addEventListener(\"click\",n);document.getElementById(\"new-course-form\")?.addEventListener(\"submit\",async e=>{e.preventDefault();const o=e.target,s=new FormData(o),t=Object.fromEntries(s.entries());t.is_published=t.is_published?1:0,t.sort_order=parseInt(t.sort_order)||0;const d=await fetch(\"/api/admin/courses\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(t)});if(d.ok)n(),window.location.href=`/admin/courses/${t.id}`;else{const r=await d.json();showToast(\"Lỗi: \"+(r.error??\"Không rõ\"),\"error\")}});document.querySelectorAll(\"[data-edit-course]\").forEach(e=>{e.addEventListener(\"click\",async()=>{const o=e.dataset.editCourse;window.location.href=`/admin/courses/${o}`})});document.querySelectorAll(\"[data-delete-course]\").forEach(e=>{e.addEventListener(\"click\",async()=>{const o=e.dataset.deleteCourse;if(!confirm(\"Xóa khóa học này? Tất cả video trong khóa học cũng sẽ bị xóa.\"))return;(await fetch(`/api/admin/courses/${o}`,{method:\"DELETE\"})).ok?e.closest(\"tr\")?.remove():showToast(\"Xóa thất bại\",\"error\")})});"],["C:/dentalempireos/src/pages/admin/ebooks/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const v=Array.from(document.querySelectorAll(\".filter-chip\")),A=Array.from(document.querySelectorAll(\".ebook-card\")),C=Array.from(document.querySelectorAll(\".ebook-tier-group\")),S=document.getElementById(\"ebook-empty\");let l=\"all\";function T(){v.forEach(t=>{const e=t.dataset.filter===l;t.classList.toggle(\"bg-primary\",e),t.classList.toggle(\"text-on-primary\",e),t.classList.toggle(\"border-primary\",e),t.classList.toggle(\"bg-surface-container-high\",!e),t.classList.toggle(\"text-on-surface-variant\",!e),t.classList.toggle(\"border-outline-variant\",!e)})}function w(){let t=0;A.forEach(e=>{const r=e.dataset.tier??\"\",o=e.dataset.status??\"\";let a=!0;l===\"all\"?a=!0:l===\"published\"||l===\"draft\"?a=o===l:a=r===l,e.classList.toggle(\"hidden\",!a),a&&(t+=1)}),C.forEach(e=>{const r=e.querySelectorAll(\".ebook-card:not(.hidden)\").length>0;e.classList.toggle(\"hidden\",!r)}),S?.classList.toggle(\"hidden\",t!==0)}v.forEach(t=>{t.addEventListener(\"click\",()=>{l=t.dataset.filter??\"all\",T(),w()})});document.addEventListener(\"click\",async t=>{const e=t.target.closest(\"[data-delete-chapter]\");if(!e)return;const r=e.dataset.deleteChapter,o=e.dataset.chapterTitle||\"\";if(r&&confirm(`Xóa chương \"${o}\"?\n\nMọi đề mục và block bên trong sẽ bị xóa vĩnh viễn.`))try{(await fetch(`/api/admin/chapters/${r}`,{method:\"DELETE\",credentials:\"include\"})).ok?location.reload():showToast(\"Lỗi khi xóa chương.\",\"error\")}catch{showToast(\"Lỗi khi xóa chương.\",\"error\")}});let n=null;const u=Array.from(document.querySelectorAll(\".tier-chapters\"));u.forEach(t=>{t.addEventListener(\"dragstart\",e=>{const r=e.target.closest(\".ebook-card\");r&&(n=r,r.style.opacity=\"0.4\",e.dataTransfer.effectAllowed=\"move\")}),t.addEventListener(\"dragend\",()=>{n&&(n.style.opacity=\"\"),n=null,p()})});u.forEach(t=>{t.addEventListener(\"dragover\",e=>{if(e.preventDefault(),!n)return;e.dataTransfer.dropEffect=\"move\",p();const r=e.target.closest(\".ebook-card\");if(r&&r!==n){const o=r.getBoundingClientRect(),a=e.clientY<o.top+o.height/2;r.classList.add(a?\"drag-above\":\"drag-below\")}else t.classList.add(\"drag-grid-active\")})});u.forEach(t=>{t.addEventListener(\"drop\",async e=>{if(e.preventDefault(),p(),!n)return;const r=n.closest(\".tier-chapters\"),o=r?parseInt(r.dataset.tier??\"0\"):0,a=parseInt(t.dataset.tier??\"0\"),d=n.dataset.chapterId,y=o!==a;if(y){try{if(!(await fetch(`/api/admin/chapters/${d}`,{method:\"PUT\",headers:{\"Content-Type\":\"application/json\"},credentials:\"include\",body:JSON.stringify({tier:a})})).ok){showToast(\"Lỗi khi di chuyển chương.\",\"error\"),location.reload();return}}catch{showToast(\"Lỗi khi di chuyển chương.\",\"error\"),location.reload();return}const c=n;c.dataset.tier=`tier-${a}`;const s=e.target.closest(\".ebook-card\");if(s&&s!==c){const i=s.getBoundingClientRect();e.clientY<i.top+i.height/2?s.parentElement?.insertBefore(c,s.nextSibling):s.parentElement?.insertBefore(c,s)}else t.appendChild(c);await g(r),await g(t)}else{const c=e.target.closest(\".ebook-card\");if(!c||c===n)return;const s=Array.from(t.querySelectorAll(\".ebook-card\")),i=s.indexOf(n),f=s.indexOf(c);if(i<0||f<0)return;const m=c.getBoundingClientRect(),h=e.clientY<m.top+m.height/2?f:f+1,E=s.splice(i,1)[0],L=h>i?h-1:h;s.splice(L,0,E),s.forEach(k=>t.appendChild(k)),await g(t)}b(o),y&&b(a)})});async function g(t){if(!t)return;const e=parseInt(t.dataset.tier??\"0\"),r=Array.from(t.querySelectorAll(\".ebook-card\")).map(o=>o.dataset.chapterId);try{await fetch(\"/api/admin/chapters/reorder\",{method:\"PUT\",headers:{\"Content-Type\":\"application/json\"},credentials:\"include\",body:JSON.stringify({tier:e,ids:r})})}catch{}}function b(t){const e=document.querySelector(`.tier-chapters[data-tier=\"${t}\"]`);if(!e)return;Array.from(e.querySelectorAll(\".ebook-card:not(.hidden)\")).forEach((o,a)=>{const d=o.querySelector(\".chapter-num\");d&&(d.textContent=String(a+1).padStart(2,\"0\"))})}function p(){document.querySelectorAll(\".drag-above, .drag-below, .drag-grid-active\").forEach(t=>t.classList.remove(\"drag-above\",\"drag-below\",\"drag-grid-active\"))}"],["C:/dentalempireos/src/pages/admin/ebooks/new.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const n=document.getElementById(\"new-chapter-form\"),r=document.getElementById(\"form-error\");n.addEventListener(\"submit\",async o=>{o.preventDefault(),r.classList.add(\"hidden\");const t=new FormData(n),s={tier:Number(t.get(\"tier\")),chapter_no:Number(t.get(\"chapter_no\")),title:String(t.get(\"title\")||\"\").trim(),description:String(t.get(\"description\")||\"\").trim(),status:String(t.get(\"status\")||\"draft\"),order:Number(t.get(\"chapter_no\"))},e=await fetch(\"/api/admin/chapters\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},credentials:\"include\",body:JSON.stringify(s)});if(!e.ok){const i=await e.json().catch(()=>({}));r.textContent=i.error||`Lỗi ${e.status}`,r.classList.remove(\"hidden\");return}const{id:a}=await e.json();window.location.href=`/admin/ebooks/${a}`});"],["C:/dentalempireos/src/pages/admin/scanners/[id]/response/[id].astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.getElementById(\"btn-reanalyze\")?.addEventListener(\"click\",async n=>{const e=n.currentTarget,a=e.dataset.responseId;if(a&&confirm(\"Re-run AI analysis cho response này?\")){e.setAttribute(\"disabled\",\"true\"),e.innerHTML=\"<span>Đang phân tích...</span>\",window.showToast?.(\"Đang gọi AI...\",\"info\");try{const t=await fetch(`/api/admin/scanner/regenerate-ai?id=${a}`,{method:\"POST\"});if(!t.ok){const s=await t.json().catch(()=>({}));throw new Error(s.error||\"Re-analyze thất bại\")}window.showToast?.(\"Đã tạo AI analysis mới\",\"success\"),setTimeout(()=>window.location.reload(),800)}catch(t){alert(t instanceof Error?t.message:\"Re-analyze thất bại\"),e.removeAttribute(\"disabled\"),e.innerHTML='<span class=\"material-symbols-outlined text-[18px]\">auto_awesome</span> Re-analyze AI'}}});"],["C:/dentalempireos/src/pages/admin/scanners/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const u=document.getElementById(\"create-modal\"),l=document.getElementById(\"create-modal-backdrop\"),c=document.getElementById(\"create-modal-panel\"),d=document.getElementById(\"create-form\"),r=document.getElementById(\"form-error\");function h(){u.classList.remove(\"hidden\"),requestAnimationFrame(()=>{l.classList.replace(\"bg-black/0\",\"bg-black/60\"),c.classList.remove(\"scale-95\",\"opacity-0\"),c.classList.add(\"scale-100\",\"opacity-100\")})}function m(){l.classList.replace(\"bg-black/60\",\"bg-black/0\"),c.classList.remove(\"scale-100\",\"opacity-100\"),c.classList.add(\"scale-95\",\"opacity-0\"),setTimeout(()=>{u.classList.add(\"hidden\"),d.reset(),r.classList.add(\"hidden\")},300)}document.getElementById(\"btn-create\")?.addEventListener(\"click\",h);document.getElementById(\"btn-create-2\")?.addEventListener(\"click\",h);document.getElementById(\"modal-close\")?.addEventListener(\"click\",m);document.getElementById(\"modal-cancel\")?.addEventListener(\"click\",m);l.addEventListener(\"click\",m);d.addEventListener(\"submit\",async t=>{t.preventDefault(),r.classList.add(\"hidden\");const s=new FormData(d),a={title_vi:String(s.get(\"title_vi\")??\"\").trim(),title_en:String(s.get(\"title_en\")??\"\").trim(),slug:String(s.get(\"slug\")??\"\").trim()||void 0,survey_type:String(s.get(\"survey_type\")??\"full\"),status:String(s.get(\"status\")??\"draft\")};try{const e=await fetch(\"/api/admin/scanner-definitions\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(a)}),n=await e.json();if(!e.ok||!n.id)throw new Error(n.error||\"Tạo thất bại\");window.showToast?.(\"Tạo scanner thành công!\",\"success\"),setTimeout(()=>{window.location.href=`/admin/scanners/${n.id}`},600)}catch(e){r.textContent=e instanceof Error?e.message:\"Tạo thất bại\",r.classList.remove(\"hidden\")}});document.querySelectorAll(\".btn-delete\").forEach(t=>{t.addEventListener(\"click\",async()=>{const s=t.dataset.id,a=t.dataset.name;if(s&&confirm(`Xóa scanner \"${a}\"?\n\nToàn bộ sections, questions và responses sẽ bị xoá vĩnh viễn.`))try{const e=await fetch(`/api/admin/scanner-definitions/${s}`,{method:\"DELETE\"});if(!e.ok){const n=await e.json();throw new Error(n.error||\"Xóa thất bại\")}window.showToast?.(\"Đã xóa scanner\",\"success\"),setTimeout(()=>window.location.reload(),400)}catch(e){alert(e instanceof Error?e.message:\"Xóa thất bại\")}})});document.querySelectorAll(\".btn-seed\").forEach(t=>{t.addEventListener(\"click\",async()=>{const s=t.dataset.seedId,a=t.dataset.seedName,e=t.dataset.reimport===\"1\";if(!s)return;const n=e?`Re-import \"${a}\"?\n\nDữ liệu hiện tại sẽ bị ghi đè.`:`Import \"${a}\" vào database?`;if(confirm(n)){t.setAttribute(\"disabled\",\"true\"),window.showToast?.(\"Đang import...\",\"info\",2e3);try{const o=await fetch(`/api/admin/seed-scanner/${s}`,{method:\"POST\"}),i=await o.json();if(!o.ok||!i.success)throw new Error(i.error||\"Import thất bại\");window.showToast?.(`Đã import ${i.sections_added} phần, ${i.questions_added} câu hỏi`,\"success\",3e3),setTimeout(()=>window.location.reload(),800)}catch(o){alert(o instanceof Error?o.message:\"Import thất bại\"),t.removeAttribute(\"disabled\")}}})});"],["C:/dentalempireos/src/pages/admin/settings/payos.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const r=document.getElementById(\"payos-form\"),c=document.getElementById(\"field-is_active\"),h=document.getElementById(\"field-sandbox_mode\"),u=document.getElementById(\"credentials-fields\"),n=document.getElementById(\"save-status\"),s=document.getElementById(\"btn-register-webhook\");function m(){c.checked?u.classList.remove(\"opacity-40\",\"pointer-events-none\"):u.classList.add(\"opacity-40\",\"pointer-events-none\")}c.addEventListener(\"change\",m);m();document.querySelectorAll('input[type=\"password\"]').forEach(o=>{const e=o,t=e.dataset.masked;t&&t!==\"\"&&e.value===t&&(e.value=\"\"),e.addEventListener(\"focus\",()=>{t&&t!==\"\"&&e.value===\"\"&&(e.placeholder=`Đang giữ giá trị: ${t}`)}),e.addEventListener(\"blur\",()=>{e.placeholder=e.defaultValue?\"\":\"Nhập mới để thay đổi\"})});r.addEventListener(\"submit\",async o=>{o.preventDefault();const e=r.querySelector('button[type=\"submit\"]');e.disabled=!0,n.textContent=\"Đang lưu...\";const t=document.getElementById(\"field-client_id\").value,i=document.getElementById(\"field-api_key\").value,a=document.getElementById(\"field-checksum_key\").value,y=document.getElementById(\"field-webhook_url\").value,d={client_id:t,webhook_url:y,sandbox_mode:h.checked?1:0,is_active:c.checked?1:0};i&&!i.includes(\"•\")&&(d.api_key=i),a&&!a.includes(\"•\")&&(d.checksum_key=a);try{const l=await fetch(\"/api/admin/payos-settings\",{method:\"PUT\",headers:{\"Content-Type\":\"application/json\"},credentials:\"include\",body:JSON.stringify(d)});if(l.ok)n.textContent=\"✓ Đã lưu\",setTimeout(()=>{n.textContent=\"\"},3e3);else{const k=await l.json();n.textContent=k.error||\"✗ Lỗi khi lưu\"}}catch{n.textContent=\"✗ Lỗi kết nối\"}finally{e.disabled=!1}});s.addEventListener(\"click\",async()=>{s.textContent=\"Đang đăng ký...\",s.setAttribute(\"disabled\",\"true\");try{const o=await fetch(\"/api/admin/payos-settings\",{method:\"POST\",credentials:\"include\"}),e=await o.json();o.ok?n.textContent=`✓ Webhook đã đăng ký: ${e.webhookUrl}`:n.textContent=e.error||\"✗ Lỗi đăng ký webhook\"}catch{n.textContent=\"✗ Lỗi kết nối\"}finally{s.textContent=\"Đăng ký\",s.removeAttribute(\"disabled\")}});"],["C:/dentalempireos/src/pages/admin/settings/support.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const i=document.getElementById(\"support-form\"),d=document.getElementById(\"field-enabled\"),l=document.getElementById(\"content-fields\"),a=document.getElementById(\"save-status\"),n=document.getElementById(\"qr-upload-area\"),s=document.getElementById(\"qr-file-input\"),m=document.getElementById(\"field-qr_url\"),r=document.getElementById(\"qr-upload-progress\"),c=document.getElementById(\"qr-progress-bar\"),u=document.getElementById(\"qr-upload-status\");function p(){d.checked?l.classList.remove(\"opacity-40\",\"pointer-events-none\"):l.classList.add(\"opacity-40\",\"pointer-events-none\")}d.addEventListener(\"change\",p);p();n.addEventListener(\"click\",()=>s.click());n.addEventListener(\"dragover\",t=>{t.preventDefault(),n.classList.add(\"border-primary\",\"bg-primary/5\")});n.addEventListener(\"dragleave\",()=>{n.classList.remove(\"border-primary\",\"bg-primary/5\")});n.addEventListener(\"drop\",t=>{t.preventDefault(),n.classList.remove(\"border-primary\",\"bg-primary/5\");const e=t.dataTransfer?.files;e&&e.length>0&&(s.files=e,g(e[0]))});s.addEventListener(\"change\",()=>{s.files&&s.files.length>0&&g(s.files[0])});async function g(t){if(!t.type.startsWith(\"image/\")){showToast(\"Vui lòng chọn file ảnh\",\"error\");return}if(t.size>10*1024*1024){showToast(\"File quá lớn (tối đa 10MB)\",\"error\");return}r.classList.remove(\"hidden\"),c.style.width=\"0%\",u.textContent=\"Đang upload...\";try{const e=new FormData;e.append(\"file\",t),e.append(\"purpose\",\"support\");const o=await fetch(\"/api/admin/upload\",{method:\"POST\",credentials:\"include\",body:e});if(!o.ok){const f=await o.text();throw new Error(f)}const y=`/media/${(await o.json()).r2_key}`;m.value=y,c.style.width=\"100%\",u.textContent=\"✓ Upload thành công\",setTimeout(()=>{r.classList.add(\"hidden\")},2e3)}catch(e){r.classList.add(\"hidden\"),showToast(`Lỗi upload: ${e instanceof Error?e.message:\"Unknown error\"}`,\"error\")}}i.addEventListener(\"submit\",async t=>{t.preventDefault();const e=i.querySelector('button[type=\"submit\"]');e.disabled=!0,a.textContent=\"Đang lưu...\";try{(await fetch(\"/api/admin/support-settings\",{method:\"PUT\",headers:{\"Content-Type\":\"application/json\"},credentials:\"include\",body:JSON.stringify({enabled:d.checked?1:0,title:document.getElementById(\"field-title\").value,message:document.getElementById(\"field-message\").value,qr_url:m.value,payment_methods:document.getElementById(\"field-payment_methods\").value})})).ok?(a.textContent=\"✓ Đã lưu\",setTimeout(()=>{a.textContent=\"\"},3e3)):a.textContent=\"✗ Lỗi khi lưu\"}catch{a.textContent=\"✗ Lỗi kết nối\"}finally{e.disabled=!1}});"],["C:/dentalempireos/src/pages/admin/users/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.querySelectorAll(\".toggle-active-btn\").forEach(e=>{e.addEventListener(\"click\",async()=>{const o=e.dataset.userId;if(o){e.disabled=!0;try{const s=await fetch(\"/api/admin/users\",{method:\"PATCH\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({userId:o})});if(s.ok)window.location.reload();else{const a=await s.json();showToast(a.error||\"Lỗi khi cập nhật\",\"error\")}}catch{showToast(\"Lỗi kết nối\",\"error\")}finally{e.disabled=!1}}})});"],["C:/dentalempireos/src/pages/ai-mentor/[slug].astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const p=`deos-ai-mentor-${location.pathname}`;let t=JSON.parse(localStorage.getItem(p)||\"null\")??[];const a=document.getElementById(\"chat-messages\"),u=document.getElementById(\"chat-form\"),o=document.getElementById(\"chat-input\"),r=document.getElementById(\"send-btn\"),i=document.getElementById(\"ai-warning\"),g=location.pathname.split(\"/\").pop()??\"\",h=new URLSearchParams(location.search).get(\"chapter\")??\"\";function m(e){return e.replace(/&/g,\"&amp;\").replace(/</g,\"&lt;\").replace(/>/g,\"&gt;\")}function c(){a&&(a.innerHTML=t.map(e=>`\n        <div class=\"flex ${e.role===\"user\"?\"justify-end\":\"justify-start\"}\">\n          <div class=\"max-w-[80%] rounded-2xl px-4 py-3 ${e.role===\"user\"?\"rounded-tr-sm bg-primary text-white\":\"rounded-tl-sm bg-surface-container-high text-on-surface\"}\">\n            <p class=\"text-sm leading-relaxed whitespace-pre-wrap\">${m(e.content)}</p>\n          </div>\n        </div>\n      `).join(\"\"),a.scrollTop=a.scrollHeight)}function l(e){if(r){r.disabled=e;const s=r.querySelector(\".material-symbols-outlined\");s&&(s.textContent=e?\"hourglass_empty\":\"send\")}o&&(o.disabled=e)}function d(){localStorage.setItem(p,JSON.stringify(t.slice(-30)))}c();u?.addEventListener(\"submit\",async e=>{e.preventDefault();const s=o.value.trim();if(s){o.value=\"\",t.push({role:\"user\",content:s}),t.push({role:\"assistant\",content:\"...\"}),c(),l(!0),d();try{const n=await(await fetch(\"/api/ai-mentor/chat\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({messages:t.slice(0,-1),app_slug:g,chapter_id:h})})).json();n.error?t[t.length-1]={role:\"assistant\",content:`Lỗi: ${n.error}`}:n.reply&&(t[t.length-1]={role:\"assistant\",content:n.reply},i&&n.chunks_used===0&&i.classList.remove(\"hidden\"))}catch{t[t.length-1]={role:\"assistant\",content:\"Không thể kết nối AI. Vui lòng thử lại.\"}}c(),l(!1),d()}});"],["C:/dentalempireos/src/pages/blog/[slug].astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const a=document.getElementById(\"read-progress\"),l=document.getElementById(\"article-content\");if(a&&l){let e=function(){const n=l.getBoundingClientRect(),t=n.height,o=Math.max(0,-n.top),s=Math.min(100,o/t*100);a.style.width=`${s}%`};window.addEventListener(\"scroll\",e,{passive:!0}),e()}const d=document.querySelectorAll(\".toc-item\");if(d.length){const e=[];d.forEach(t=>{const o=t.dataset.id;if(o){const s=document.getElementById(o);s&&e.push(s)}});const n=new IntersectionObserver(t=>{t.forEach(o=>{const s=o.target.id,r=document.querySelector(`.toc-item[data-id=\"${s}\"]`);r&&o.isIntersecting&&(document.querySelectorAll(\".toc-item\").forEach(i=>i.classList.remove(\"toc-item-active\")),r.classList.add(\"toc-item-active\"))})},{rootMargin:\"-20% 0px -70% 0px\"});e.forEach(t=>n.observe(t))}const m=document.getElementById(\"article-content\");m&&m.querySelectorAll(\"h2, h3\").forEach(e=>{if(!e.id){const t=(e.textContent??\"\").toLowerCase().replace(/[^a-z0-9]+/g,\"-\").replace(/^-|-$/g,\"\");e.id=t}});const c=document.getElementById(\"copy-link-btn\");c&&c.addEventListener(\"click\",async()=>{const e=c.dataset.url??window.location.href;try{await navigator.clipboard.writeText(e);const n=c.innerHTML;c.innerHTML='<span class=\"material-symbols-outlined text-[18px]\">check</span>',c.classList.add(\"border-green-400\",\"text-green-400\"),setTimeout(()=>{c.innerHTML=n,c.classList.remove(\"border-green-400\",\"text-green-400\")},1500)}catch{const n=document.createElement(\"input\");n.value=e,document.body.appendChild(n),n.select(),document.execCommand(\"copy\"),document.body.removeChild(n)}});document.querySelectorAll(\".form-render\").forEach(e=>{e.addEventListener(\"submit\",async n=>{n.preventDefault();const t=e.querySelector('button[type=\"submit\"]'),o=t.textContent;t.disabled=!0,t.textContent=\"Đang gửi...\";try{const s=new FormData(e),r={};s.forEach((u,g)=>{r[g]=String(u)});const i=document.getElementById(\"blocks-container\")?.getAttribute(\"data-post-id\")||\"\";if(!(await fetch(\"/api/blog-form\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({post_id:i,fields:r})})).ok)throw new Error;t.textContent=\"✓ Đã gửi!\",t.classList.add(\"bg-green-600\"),e.reset(),setTimeout(()=>{t.textContent=o,t.disabled=!1,t.classList.remove(\"bg-green-600\")},3e3)}catch{t.textContent=\"Lỗi — thử lại\",t.disabled=!1,setTimeout(()=>{t.textContent=o},2e3)}})});"],["C:/dentalempireos/src/pages/blog/category/[category]/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.querySelectorAll(\"[data-sort]\").forEach(o=>{o.addEventListener(\"click\",()=>{const s=o.dataset.sort,e=new URL(window.location.href);e.searchParams.set(\"sort\",s),e.searchParams.delete(\"page\"),window.location.href=e.toString()})});"],["C:/dentalempireos/src/pages/blog/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.getElementById(\"blog-newsletter\")?.addEventListener(\"submit\",e=>{e.preventDefault();const t=e.target,s=t.elements.namedItem(\"email\").value;fetch(\"/api/newsletter\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:s})}).then(()=>{t.classList.add(\"hidden\"),document.getElementById(\"newsletter-success\")?.classList.remove(\"hidden\")})});"],["C:/dentalempireos/src/pages/book/[...slug].astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const i=document.getElementById(\"newsletter-form\"),l=document.getElementById(\"newsletter-email\"),t=document.getElementById(\"newsletter-submit\"),s=document.getElementById(\"newsletter-success\"),e=document.getElementById(\"newsletter-error\"),a=document.getElementById(\"newsletter-widget\"),c=a?.dataset.chapterSlug||\"\";i?.addEventListener(\"submit\",async o=>{o.preventDefault();const d=l?.value.trim();if(d){t&&(t.disabled=!0,t.textContent=\"...\"),s&&s.classList.add(\"hidden\"),e&&e.classList.add(\"hidden\");try{const n=await(await fetch(\"/api/newsletter\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:d,source:\"book\",post_slug:c})})).json();n.success?(s&&(s.textContent=n.message||\"Đăng ký thành công!\",s.classList.remove(\"hidden\")),i&&i.classList.add(\"hidden\")):e&&(e.textContent=n.error||\"Có lỗi xảy ra.\",e.classList.remove(\"hidden\"))}catch{e&&(e.textContent=\"Không thể kết nối.\",e.classList.remove(\"hidden\"))}finally{t&&(t.disabled=!1,t.textContent=\"Đăng ký\")}}});"],["C:/dentalempireos/src/pages/courses/[id].astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};function d(e){const s=e.dataset.videoId,t=e.dataset.videoTitle,i=document.getElementById(\"player-container\");i.innerHTML=`<div class=\"video-player-wrapper relative w-full\" style=\"padding-top: 56.25%;\">\n      <iframe\n        class=\"absolute inset-0 w-full h-full rounded-xl\"\n        src=\"https://www.youtube.com/embed/${s}?rel=0&modestbranding=1&autoplay=1\"\n        title=\"${t.replace(/\"/g,\"&quot;\")}\"\n        frameborder=\"0\"\n        allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\"\n        allowfullscreen\n      ></iframe>\n    </div>`;const r=document.getElementById(\"current-title\"),o=document.getElementById(\"current-desc\");r&&(r.textContent=t);const l=e.dataset.videoObj?JSON.parse(e.dataset.videoObj):null;o&&(o.textContent=l?.description??\"\"),document.querySelectorAll(\".video-item\").forEach(a=>{a.classList.remove(\"bg-primary/10\",\"border-primary/30\"),a.classList.add(\"bg-surface-container\",\"border-transparent\")}),e.classList.add(\"bg-primary/10\",\"border-primary/30\"),e.classList.remove(\"bg-surface-container\",\"border-transparent\")}window.selectVideo=d;"],["C:/dentalempireos/src/pages/resources/index.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.getElementById(\"resources-newsletter\")?.addEventListener(\"submit\",e=>{e.preventDefault();const t=e.target,s=t.elements.namedItem(\"email\").value;fetch(\"/api/newsletter\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:s})}).then(()=>{t.classList.add(\"hidden\"),document.getElementById(\"newsletter-success\")?.classList.remove(\"hidden\")})});"],["C:/dentalempireos/src/pages/reviews.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};const e=document.getElementById(\"load-more-reviews\"),s=document.getElementById(\"reviews-grid\");e?.addEventListener(\"click\",async()=>{const a=parseInt(e.getAttribute(\"data-offset\")??\"0\");e.textContent=\"Đang tải...\";try{const n=await(await fetch(`/api/public/reviews/latest?limit=20&offset=${a}`)).json();if(!n||n.length===0){e.textContent=\"Hết đánh giá\",e.disabled=!0;return}for(const t of n){const r=document.createElement(\"div\");r.innerHTML=`\n            <article class=\"review-card bg-surface-container rounded-2xl border border-outline-variant/40 p-5 transition-all duration-300 hover:border-outline-variant/70\">\n              <div class=\"flex items-center gap-3 mb-3\">\n                <div class=\"w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm\">\n                  ${(t.user_name||t.author_name||\"Ẩn danh\").charAt(0).toUpperCase()}\n                </div>\n                <div class=\"min-w-0\">\n                  <p class=\"font-semibold text-white text-sm truncate\">${t.user_name||t.author_name||\"Ẩn danh\"}</p>\n                  <div class=\"flex items-center gap-2\">\n                    ${t.chapter_title?`<a href=\"/book/${t.chapter_id}\" class=\"text-xs text-primary hover:underline truncate\">${t.chapter_title}</a>`:\"\"}\n                  </div>\n                </div>\n              </div>\n              <div class=\"flex items-center gap-0.5 mb-2\">\n                ${Array.from({length:5},(o,i)=>`<span class=\"material-symbols-outlined text-lg ${i<t.rating?\"text-amber-400\":\"text-on-surface-variant/30\"}\" style=\"font-variation-settings: 'FILL' 1;\">star</span>`).join(\"\")}\n              </div>\n              ${t.title?`<p class=\"font-semibold text-white text-sm mb-1\">${t.title}</p>`:\"\"}\n              <p class=\"text-sm text-on-surface-variant leading-relaxed whitespace-pre-line\">${t.content}</p>\n            </article>\n          `,s?.appendChild(r.firstElementChild)}e.setAttribute(\"data-offset\",String(a+n.length)),e.textContent=\"Xem thêm đánh giá\"}catch{e.textContent=\"Thử lại\"}});"],["C:/dentalempireos/src/pages/scanner/pack.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.getElementById(\"buy-pack-btn\")?.addEventListener(\"click\",async()=>{const e=document.getElementById(\"buy-pack-btn\");e.disabled=!0,e.textContent=\"Đang chuyển...\";try{const t=await(await fetch(\"/api/payos/create-payment\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({product_id:\"prod-scanner-pack\"})})).json();t.checkoutUrl?window.location.href=t.checkoutUrl:(alert(t.error??\"Có lỗi xảy ra\"),e.disabled=!1,e.textContent=\"Mua Scanner Pack — 499.000đ\")}catch{alert(\"Có lỗi xảy ra\"),e.disabled=!1,e.textContent=\"Mua Scanner Pack — 499.000đ\"}});"]],"assets":["/apple-touch-icon.png","/apple-touch-icon.svg","/favicon-16.png","/favicon-192.png","/favicon-32.png","/favicon.ico","/favicon.svg","/robots.txt","/site.webmanifest","/sw.js","/_headers","/_routes.json","/files/crm-tracker.xlsx","/files/financial-report.xlsx","/files/kpi-dashboard.xlsx","/files/marketing-plan.pdf","/files/sop-checklist.pdf","/files/tuyen-dung-template.pdf","/icons/apple-touch-icon.png","/icons/icon-192.png","/icons/icon-512.png","/icons/maskable-512.png","/images/logo-header.png","/images/og-image.png","/images/og-image.svg","/scripts/scanner-form-client.js","/_astro/ai-settings.astro_astro_type_script_index_0_lang.DZvPGkiY.js","/_astro/auth-client.D4n2Lz_0.js","/_astro/BookLayout.astro_astro_type_script_index_0_lang.BonaMplx.js","/_astro/BookLayout.astro_astro_type_script_index_1_lang.d-cei8x7.js","/_astro/BookLayout.astro_astro_type_script_index_2_lang.BR3pTUll.js","/_astro/categories.astro_astro_type_script_index_0_lang.BybIhyEE.js","/_astro/clinic.astro_astro_type_script_index_0_lang.ck_5zumI.js","/_astro/Header.astro_astro_type_script_index_0_lang.Cdz8YgKY.js","/_astro/ho-so-goc-re.astro_astro_type_script_index_0_lang.HqKWo_6E.js","/_astro/homepage.astro_astro_type_script_index_0_lang.B2ehEjsJ.js","/_astro/index.astro_astro_type_script_index_0_lang.CDLfvTus.js","/_astro/login.astro_astro_type_script_index_0_lang.Bogv1o0v.js","/_astro/MobileBottomNav.astro_astro_type_script_index_0_lang.CCSiUUQ7.js","/_astro/new.astro_astro_type_script_index_0_lang.D8tUllKj.js","/_astro/page.B9eF5IcF.js","/_astro/preload-helper.C6pNqXq6.js","/_astro/profile.astro_astro_type_script_index_0_lang.cMt1XRzK.js","/_astro/register.astro_astro_type_script_index_0_lang.DW7Ki85_.js","/_astro/ReviewDrawer.astro_astro_type_script_index_0_lang.BqGmdET1.js","/_astro/richtext-editor.CyqJ8vxG.js","/_astro/richtext-toolbar.Dgvo_ADY.js","/_astro/SectionNavMobile.astro_astro_type_script_index_0_lang.Cnhovecy.js","/_astro/Sidebar.astro_astro_type_script_index_0_lang.BxgrY7Rt.js","/_astro/wizard.astro_astro_type_script_index_0_lang.CpgpKT_2.js","/_astro/_id_.astro_astro_type_script_index_0_lang.BSkcB8m_.js","/_astro/_id_.astro_astro_type_script_index_0_lang.DYIYJMXG.js","/_astro/_id_.astro_astro_type_script_index_0_lang.PVWiHg_Q.js","/_astro/_id_.astro_astro_type_script_index_0_lang.vLtdPOsr.js","/images/qr/donation-qr.svg","/_astro/AdminLayout.CHcnte5w.css","/_astro/global.DYUxPwJ_.css","/_astro/be-vietnam-pro-vietnamese-400-normal.CRcqvyg1.woff2","/_astro/be-vietnam-pro-vietnamese-400-normal.BuGn0gnm.woff","/_astro/be-vietnam-pro-latin-ext-400-normal.CiZNW1ec.woff2","/_astro/be-vietnam-pro-latin-ext-400-normal.DYBYyMQr.woff","/_astro/be-vietnam-pro-latin-400-normal.PpnXBOrz.woff2","/_astro/be-vietnam-pro-latin-400-normal.bXgqVju9.woff","/_astro/be-vietnam-pro-vietnamese-500-normal.DREgrEoJ.woff2","/_astro/be-vietnam-pro-vietnamese-500-normal.CfdwVo8-.woff","/_astro/be-vietnam-pro-latin-ext-500-normal.h0Fp6aX0.woff2","/_astro/be-vietnam-pro-latin-ext-500-normal.CK0UkkKf.woff","/_astro/be-vietnam-pro-latin-500-normal.B6LVzGNe.woff2","/_astro/be-vietnam-pro-latin-500-normal.BJkVuMHw.woff","/_astro/be-vietnam-pro-vietnamese-600-normal.nyU-ZL2p.woff2","/_astro/be-vietnam-pro-vietnamese-600-normal.DkpCIyan.woff","/_astro/be-vietnam-pro-latin-ext-600-normal.BNd8euf0.woff2","/_astro/be-vietnam-pro-latin-ext-600-normal.BeUwKxhG.woff","/_astro/be-vietnam-pro-latin-600-normal.BZDkUTrt.woff2","/_astro/be-vietnam-pro-latin-600-normal.5IO4e7bK.woff","/_astro/be-vietnam-pro-vietnamese-700-normal.Csr0PCuG.woff2","/_astro/be-vietnam-pro-vietnamese-700-normal.By_5yT39.woff","/_astro/be-vietnam-pro-latin-ext-700-normal.C8_gqRu2.woff2","/_astro/be-vietnam-pro-latin-ext-700-normal.4Hjo2OtD.woff","/_astro/be-vietnam-pro-latin-700-normal.DlW1Zbsh.woff2","/_astro/be-vietnam-pro-latin-700-normal.C2EtzaOi.woff","/_astro/be-vietnam-pro-vietnamese-400-italic.CIY6FnMe.woff2","/_astro/be-vietnam-pro-vietnamese-400-italic.DsRro6WU.woff","/_astro/be-vietnam-pro-latin-ext-400-italic.Crz7h8Mn.woff2","/_astro/be-vietnam-pro-latin-ext-400-italic.BsvdnA5R.woff","/_astro/be-vietnam-pro-latin-400-italic.Czf7pqeE.woff2","/_astro/be-vietnam-pro-latin-400-italic.BOmzMUnM.woff","/_astro/_slug_.DEg0HL7O.css","/_astro/_..DdqGQSrB.css","/_astro/_slug_.BuxjIUFw.css","/_astro/_id_.ZrnCxgC9.css","/_astro/page.B9eF5IcF.js"],"buildFormat":"directory","checkOrigin":true,"actionBodySizeLimit":1048576,"serverIslandBodySizeLimit":1048576,"allowedDomains":[],"key":"Dv1meJkS9BJrb8xPIFNfNf1VAx13qqjrze/TmYc8w2A=","sessionConfig":{"driver":"unstorage/drivers/cloudflare-kv-binding","options":{"binding":"SESSION"}},"image":{},"devToolbar":{"enabled":false,"debugInfoOutput":""},"logLevel":"info","shouldInjectCspMetaTags":false});
const manifestRoutes = _manifest.routes;
const manifest = Object.assign(_manifest, {
  renderers,
  actions: () => import("./noop-entrypoint_DsBX4kaI.mjs"),
  middleware: () => import("../virtual_astro_middleware.mjs"),
  sessionDriver: () => import("./_virtual_astro_session-driver_Csu6PJY6.mjs"),
  serverIslandMappings: () => import("./_virtual_astro_server-island-manifest_CFl7y3Qj.mjs"),
  routes: manifestRoutes,
  pageMap
});
const createApp$1 = ({ streaming } = {}) => {
  const app2 = new App(manifest, streaming);
  app2.setFetchHandler(fetchable);
  return app2;
};
const createApp = createApp$1;
function getFirstForwardedValue(multiValueHeader) {
  return multiValueHeader?.toString()?.split(",").map((e) => e.trim())?.[0];
}
const IP_RE = /^[0-9a-fA-F.:]{1,45}$/;
function isValidIpAddress(value) {
  return IP_RE.test(value);
}
function getValidatedIpFromHeader(headerValue) {
  const raw = getFirstForwardedValue(headerValue);
  if (raw && isValidIpAddress(raw)) {
    return raw;
  }
  return void 0;
}
function matchStaticAsset(manifest2, requestUrl, env2) {
  const { pathname } = new URL(requestUrl);
  if (manifest2.assets.has(pathname)) {
    return env2.ASSETS.fetch(requestUrl.replace(/\.html$/, ""));
  }
  return void 0;
}
async function fallbackToAssets(requestUrl, env2) {
  const asset = await env2.ASSETS.fetch(
    requestUrl.replace(/index.html$/, "").replace(/\.html$/, "")
  );
  if (asset.status !== 404) {
    return asset;
  }
  return void 0;
}
function createErrorPageFetch(env2) {
  return async (url) => {
    return env2.ASSETS.fetch(url.replace(/\.html$/, ""));
  };
}
function createLocals(ctx) {
  const locals = {
    cfContext: ctx
  };
  Object.defineProperty(locals, "runtime", {
    enumerable: false,
    value: {
      get env() {
        throw new Error(
          `Astro.locals.runtime.env has been removed in Astro v6. Use 'import { env } from "cloudflare:workers"' instead.`
        );
      },
      get cf() {
        throw new Error(
          `Astro.locals.runtime.cf has been removed in Astro v6. Use 'Astro.request.cf' instead.`
        );
      },
      get caches() {
        throw new Error(
          `Astro.locals.runtime.caches has been removed in Astro v6. Use the global 'caches' object instead.`
        );
      },
      get ctx() {
        throw new Error(
          `Astro.locals.runtime.ctx has been removed in Astro v6. Use 'Astro.locals.cfContext' instead.`
        );
      }
    }
  });
  return locals;
}
function getClientAddress(request) {
  return getValidatedIpFromHeader(request.headers.get("cf-connecting-ip"));
}
function injectSessionBinding(manifest2, env2) {
  if (env2[sessionKVBindingName]) {
    const sessionConfigOptions = manifest2.sessionConfig?.options ?? {};
    Object.assign(sessionConfigOptions, {
      binding: env2[sessionKVBindingName]
    });
  }
}
const app = createApp();
async function handle(request, env2, context) {
  injectSessionBinding(app.manifest, env2);
  const staticAsset = matchStaticAsset(app.manifest, request.url, env2);
  if (staticAsset) return staticAsset;
  let routeData = void 0;
  if (app.isDev()) {
    const result = await app.devMatch(app.getPathnameFromRequest(request));
    if (result) {
      routeData = result.routeData;
    }
  } else {
    routeData = app.match(request);
  }
  if (!routeData) {
    const asset = await fallbackToAssets(request.url, env2);
    if (asset) return asset;
  }
  const locals = createLocals(context);
  const waitUntil = context.waitUntil.bind(context);
  const response = await app.render(request, {
    routeData,
    locals,
    waitUntil,
    prerenderedErrorPageFetch: createErrorPageFetch(env2),
    clientAddress: getClientAddress(request)
  });
  if (app.setCookieHeaders) {
    for (const setCookieHeader of app.setCookieHeaders(response)) {
      response.headers.append("Set-Cookie", setCookieHeader);
    }
  }
  return response;
}
var server_default = {
  fetch: handle
};
const workerEntry = server_default ?? {};
export {
  isRemoteAllowed as i,
  renderComponent as r,
  spreadAttributes as s,
  workerEntry as w
};
