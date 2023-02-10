
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const cardDimensions={
        twoColCardHeight : "16rem",
        twoColFlexMargins : "66px",
        fiveColCardHeight : "24rem",
        fiveColFlexMargins : "164px",
        twoColContentHeight : "58%",
        fiveColContentHeight : "72%",
    };

    const addForm = {
        headingPlaceHolder : "Note Title",
        contentPlaceHolder : "Say Something",
        contentRows : "7",
        contentCols : "15",
        background : "notes background",
        cancelButton : "cancel",
        addButton : "add"
    };

    const header = {
        title : "pocket notes",
        defaultView : "default view",
        fiveColumn : "5 Column Format",
        fiveColumnValue : 5,
        twoColumnValue : 2,
        twoColumn : "2 Column Format"
    };

    const deletePopup = {
        noButton : "no",
        yesButton : "yes"
    };


    const colors = [
        {
            id:1,
            backGroundColor: "#c2e891",
        },
        {
            id:2,
            backGroundColor: "#d5e2f6",
        },
        {
            id:3,
            backGroundColor: "#dededf",
        },
        {
            id:4,
            backGroundColor: "#d9cdcf",
        }
    ];

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const notes = writable(JSON.parse(localStorage.getItem("notes")) || "");
    notes.subscribe(val => localStorage.setItem("notes",JSON.stringify(val)));

    /* src/components/Modal.svelte generated by Svelte v3.55.1 */
    const file$9 = "src/components/Modal.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});

    function create_fragment$9(ctx) {
    	let div0;
    	let t0;
    	let div3;
    	let div1;
    	let t1;
    	let t2;
    	let div2;
    	let t3;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;
    	const content_slot_template = /*#slots*/ ctx[3].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[2], get_content_slot_context);
    	const footer_slot_template = /*#slots*/ ctx[3].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[2], get_footer_slot_context);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			div2 = element("div");
    			if (content_slot) content_slot.c();
    			t3 = space();
    			footer = element("footer");
    			if (footer_slot) footer_slot.c();
    			attr_dev(div0, "class", "modal-backdrop svelte-lh1d5g");
    			add_location(div0, file$9, 10, 0, 215);
    			attr_dev(div1, "class", "header svelte-lh1d5g");
    			add_location(div1, file$9, 12, 4, 300);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file$9, 13, 4, 338);
    			attr_dev(footer, "class", "footer svelte-lh1d5g");
    			add_location(footer, file$9, 16, 4, 406);
    			attr_dev(div3, "class", "modal svelte-lh1d5g");
    			add_location(div3, file$9, 11, 0, 276);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);

    			if (content_slot) {
    				content_slot.m(div2, null);
    			}

    			append_dev(div3, t3);
    			append_dev(div3, footer);

    			if (footer_slot) {
    				footer_slot.m(footer, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "mousedown", /*modalClose*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);

    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[2], dirty, get_content_slot_changes),
    						get_content_slot_context
    					);
    				}
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[2], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content_slot, local);
    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content_slot, local);
    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			if (content_slot) content_slot.d(detaching);
    			if (footer_slot) footer_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['content','footer']);
    	let { title = "" } = $$props;
    	const dispatch = createEventDispatcher();

    	function modalClose() {
    		dispatch("closeModal");
    	}

    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		title,
    		dispatch,
    		modalClose
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, modalClose, $$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get title() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Button.svelte generated by Svelte v3.55.1 */

    const file$8 = "src/components/Button.svelte";

    function create_fragment$8(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*className*/ ctx[0]) + " svelte-1hl2380"));
    			toggle_class(button, "inverse", !/*inverse*/ ctx[1]);
    			add_location(button, file$8, 5, 0, 75);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*className*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*className*/ ctx[0]) + " svelte-1hl2380"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*className, inverse*/ 3) {
    				toggle_class(button, "inverse", !/*inverse*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { className } = $$props;
    	let { inverse = true } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (className === undefined && !('className' in $$props || $$self.$$.bound[$$self.$$.props['className']])) {
    			console.warn("<Button> was created without expected prop 'className'");
    		}
    	});

    	const writable_props = ['className', 'inverse'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    		if ('inverse' in $$props) $$invalidate(1, inverse = $$props.inverse);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ className, inverse });

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    		if ('inverse' in $$props) $$invalidate(1, inverse = $$props.inverse);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className, inverse, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { className: 0, inverse: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get className() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/DeletePopup.svelte generated by Svelte v3.55.1 */
    const file$7 = "src/components/DeletePopup.svelte";

    // (20:8) <Button on:click={cancel} className="no">
    function create_default_slot_1$1(ctx) {
    	let t_value = deletePopup.noButton + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(20:8) <Button on:click={cancel} className=\\\"no\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:8) <Button on:click={remove} className="add">
    function create_default_slot$1(ctx) {
    	let t_value = deletePopup.yesButton + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(21:8) <Button on:click={remove} className=\\\"add\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let button0;
    	let t2;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				className: "no",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*cancel*/ ctx[1]);

    	button1 = new Button({
    			props: {
    				className: "add",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*remove*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = `${/*modalContent*/ ctx[0]}`;
    			t1 = space();
    			div1 = element("div");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			attr_dev(div0, "class", "content svelte-sl6rei");
    			add_location(div0, file$7, 15, 4, 498);
    			attr_dev(div1, "class", "button svelte-sl6rei");
    			add_location(div1, file$7, 18, 4, 558);
    			add_location(div2, file$7, 14, 0, 488);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(button0, div1, null);
    			append_dev(div1, t2);
    			mount_component(button1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DeletePopup', slots, []);
    	const dispatch = createEventDispatcher();
    	let modalContent = "Deleting this note will remove all its traces from the system and cannote be rolled back. Do you really wish to delete this note?";

    	function cancel() {
    		dispatch("cancel");
    	}

    	function remove() {
    		dispatch("remove");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DeletePopup> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Button,
    		deletePopup,
    		dispatch,
    		modalContent,
    		cancel,
    		remove
    	});

    	$$self.$inject_state = $$props => {
    		if ('modalContent' in $$props) $$invalidate(0, modalContent = $$props.modalContent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [modalContent, cancel, remove];
    }

    class DeletePopup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeletePopup",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const layout = writable(JSON.parse(localStorage.getItem("layout")) || "5");
    layout.subscribe(val => localStorage.setItem("layout",JSON.stringify(val)));

    /* src/components/NotesCard.svelte generated by Svelte v3.55.1 */
    const file$6 = "src/components/NotesCard.svelte";

    // (61:0) {#if popup}
    function create_if_block$2(ctx) {
    	let backdrop;
    	let current;

    	backdrop = new Modal({
    			props: {
    				title: "confirm delete",
    				$$slots: { content: [create_content_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	backdrop.$on("close-modal", /*toggleModal*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(backdrop.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(backdrop, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const backdrop_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				backdrop_changes.$$scope = { dirty, ctx };
    			}

    			backdrop.$set(backdrop_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(backdrop.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(backdrop.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(backdrop, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(61:0) {#if popup}",
    		ctx
    	});

    	return block;
    }

    // (63:7) 
    function create_content_slot$1(ctx) {
    	let deletemodal;
    	let current;

    	deletemodal = new DeletePopup({
    			props: { slot: "content" },
    			$$inline: true
    		});

    	deletemodal.$on("cancel", /*toggleModal*/ ctx[8]);
    	deletemodal.$on("remove", /*deleteCard*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(deletemodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(deletemodal, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(deletemodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(deletemodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(deletemodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$1.name,
    		type: "slot",
    		source: "(63:7) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div2;
    	let h1;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let div1;
    	let div0;
    	let t4;
    	let t5;
    	let ion_icon;
    	let t6;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*popup*/ ctx[4] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*content*/ ctx[2]);
    			t3 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t4 = text(/*creationDate*/ ctx[3]);
    			t5 = space();
    			ion_icon = element("ion-icon");
    			t6 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(h1, "class", "header svelte-ba5lgm");
    			add_location(h1, file$6, 53, 4, 1835);
    			attr_dev(p, "class", "content svelte-ba5lgm");
    			add_location(p, file$6, 54, 4, 1871);
    			attr_dev(div0, "class", "date svelte-ba5lgm");
    			add_location(div0, file$6, 56, 8, 1937);
    			set_custom_element_data(ion_icon, "class", "delete svelte-ba5lgm");
    			set_custom_element_data(ion_icon, "name", "trash-outline");
    			add_location(ion_icon, file$6, 57, 8, 1984);
    			attr_dev(div1, "class", "footer svelte-ba5lgm");
    			add_location(div1, file$6, 55, 4, 1908);
    			attr_dev(div2, "data-index", /*id*/ ctx[0]);
    			attr_dev(div2, "class", "notes-card svelte-ba5lgm");
    			attr_dev(div2, "style", /*cardColorStyle*/ ctx[5]);
    			add_location(div2, file$6, 52, 0, 1767);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(h1, t0);
    			append_dev(div2, t1);
    			append_dev(div2, p);
    			append_dev(p, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t4);
    			append_dev(div1, t5);
    			append_dev(div1, ion_icon);
    			insert_dev(target, t6, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(ion_icon, "mousedown", /*mousedown_handler*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);
    			if (!current || dirty & /*content*/ 4) set_data_dev(t2, /*content*/ ctx[2]);
    			if (!current || dirty & /*creationDate*/ 8) set_data_dev(t4, /*creationDate*/ ctx[3]);

    			if (!current || dirty & /*id*/ 1) {
    				attr_dev(div2, "data-index", /*id*/ ctx[0]);
    			}

    			if (!current || dirty & /*cardColorStyle*/ 32) {
    				attr_dev(div2, "style", /*cardColorStyle*/ ctx[5]);
    			}

    			if (/*popup*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*popup*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t6);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let cardColorStyle;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotesCard', slots, []);
    	let { id = null } = $$props;
    	let { title = "" } = $$props;
    	let { content = "Please add some" } = $$props;
    	let { creationDate = "" } = $$props;
    	let { backGroundColor = "" } = $$props;
    	let column = "5";
    	let contentheight = cardDimensions.fiveColContentHeight;
    	let cardHeight = cardDimensions.fiveColCardHeight;
    	let flexMargins = cardDimensions.fiveColFlexMargins;
    	let deletingId = null;
    	let popup = false;

    	layout.subscribe(col => {
    		$$invalidate(10, column = col);

    		if (col == "2") {
    			$$invalidate(12, cardHeight = cardDimensions.twoColCardHeight);
    			$$invalidate(13, flexMargins = cardDimensions.twoColFlexMargins);
    			$$invalidate(11, contentheight = cardDimensions.twoColContentHeight);
    		} else {
    			$$invalidate(12, cardHeight = cardDimensions.fiveColCardHeight);
    			$$invalidate(13, flexMargins = cardDimensions.fiveColFlexMargins);
    			$$invalidate(11, contentheight = cardDimensions.fiveColContentHeight);
    		}
    	});

    	function deleteCard() {
    		toggleModal();

    		notes.update(notes => {
    			return notes.filter(note => note.id !== deletingId);
    		});
    	}

    	function deleteMyNote(selectedId) {
    		deletingId = selectedId;
    		toggleModal();
    	}

    	let toggleModal = () => {
    		$$invalidate(4, popup = !popup);
    	};

    	const writable_props = ['id', 'title', 'content', 'creationDate', 'backGroundColor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotesCard> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = () => {
    		deleteMyNote(id);
    	};

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('content' in $$props) $$invalidate(2, content = $$props.content);
    		if ('creationDate' in $$props) $$invalidate(3, creationDate = $$props.creationDate);
    		if ('backGroundColor' in $$props) $$invalidate(9, backGroundColor = $$props.backGroundColor);
    	};

    	$$self.$capture_state = () => ({
    		cardDimensions,
    		notes,
    		BackDrop: Modal,
    		DeleteModal: DeletePopup,
    		layout,
    		id,
    		title,
    		content,
    		creationDate,
    		backGroundColor,
    		column,
    		contentheight,
    		cardHeight,
    		flexMargins,
    		deletingId,
    		popup,
    		deleteCard,
    		deleteMyNote,
    		toggleModal,
    		cardColorStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('content' in $$props) $$invalidate(2, content = $$props.content);
    		if ('creationDate' in $$props) $$invalidate(3, creationDate = $$props.creationDate);
    		if ('backGroundColor' in $$props) $$invalidate(9, backGroundColor = $$props.backGroundColor);
    		if ('column' in $$props) $$invalidate(10, column = $$props.column);
    		if ('contentheight' in $$props) $$invalidate(11, contentheight = $$props.contentheight);
    		if ('cardHeight' in $$props) $$invalidate(12, cardHeight = $$props.cardHeight);
    		if ('flexMargins' in $$props) $$invalidate(13, flexMargins = $$props.flexMargins);
    		if ('deletingId' in $$props) deletingId = $$props.deletingId;
    		if ('popup' in $$props) $$invalidate(4, popup = $$props.popup);
    		if ('toggleModal' in $$props) $$invalidate(8, toggleModal = $$props.toggleModal);
    		if ('cardColorStyle' in $$props) $$invalidate(5, cardColorStyle = $$props.cardColorStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*backGroundColor, cardHeight, flexMargins, column, contentheight*/ 15872) {
    			$$invalidate(5, cardColorStyle = `--note-color:${backGroundColor};
                        --card-height:${cardHeight};
                        --margin-constant:${flexMargins};
                        --col:${column};
                        --content-height:${contentheight}`);
    		}
    	};

    	return [
    		id,
    		title,
    		content,
    		creationDate,
    		popup,
    		cardColorStyle,
    		deleteCard,
    		deleteMyNote,
    		toggleModal,
    		backGroundColor,
    		column,
    		contentheight,
    		cardHeight,
    		flexMargins,
    		mousedown_handler
    	];
    }

    class NotesCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			id: 0,
    			title: 1,
    			content: 2,
    			creationDate: 3,
    			backGroundColor: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotesCard",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get id() {
    		throw new Error("<NotesCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<NotesCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<NotesCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<NotesCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content() {
    		throw new Error("<NotesCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<NotesCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get creationDate() {
    		throw new Error("<NotesCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set creationDate(value) {
    		throw new Error("<NotesCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backGroundColor() {
    		throw new Error("<NotesCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backGroundColor(value) {
    		throw new Error("<NotesCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ColorBox.svelte generated by Svelte v3.55.1 */

    const file$5 = "src/components/ColorBox.svelte";

    // (11:4) {#if selectedColor === backGroundColor}
    function create_if_block$1(ctx) {
    	let ion_icon;

    	const block = {
    		c: function create() {
    			ion_icon = element("ion-icon");
    			set_custom_element_data(ion_icon, "class", "check");
    			set_custom_element_data(ion_icon, "name", "checkmark-outline");
    			add_location(ion_icon, file$5, 11, 8, 368);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ion_icon, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ion_icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(11:4) {#if selectedColor === backGroundColor}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let if_block = /*selectedColor*/ ctx[0] === /*backGroundColor*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "box svelte-14okc92");
    			attr_dev(div, "style", /*boxColorStyle*/ ctx[2]);
    			add_location(div, file$5, 9, 0, 241);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(div, "mousedown", /*updateSelectedColor*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*selectedColor*/ ctx[0] === /*backGroundColor*/ ctx[1]) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*boxColorStyle*/ 4) {
    				attr_dev(div, "style", /*boxColorStyle*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let boxColorStyle;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ColorBox', slots, []);
    	let { backGroundColor = "#fff" } = $$props;
    	let { selectedColor = "#fff" } = $$props;

    	function updateSelectedColor() {
    		$$invalidate(0, selectedColor = backGroundColor);
    	}

    	const writable_props = ['backGroundColor', 'selectedColor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ColorBox> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('backGroundColor' in $$props) $$invalidate(1, backGroundColor = $$props.backGroundColor);
    		if ('selectedColor' in $$props) $$invalidate(0, selectedColor = $$props.selectedColor);
    	};

    	$$self.$capture_state = () => ({
    		backGroundColor,
    		selectedColor,
    		updateSelectedColor,
    		boxColorStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ('backGroundColor' in $$props) $$invalidate(1, backGroundColor = $$props.backGroundColor);
    		if ('selectedColor' in $$props) $$invalidate(0, selectedColor = $$props.selectedColor);
    		if ('boxColorStyle' in $$props) $$invalidate(2, boxColorStyle = $$props.boxColorStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*backGroundColor*/ 2) {
    			$$invalidate(2, boxColorStyle = `--box-color:${backGroundColor};`);
    		}
    	};

    	return [selectedColor, backGroundColor, boxColorStyle, updateSelectedColor];
    }

    class ColorBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { backGroundColor: 1, selectedColor: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorBox",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get backGroundColor() {
    		throw new Error("<ColorBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backGroundColor(value) {
    		throw new Error("<ColorBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedColor() {
    		throw new Error("<ColorBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedColor(value) {
    		throw new Error("<ColorBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let nanoid = (size = 21) =>
      crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
        byte &= 63;
        if (byte < 36) {
          id += byte.toString(36);
        } else if (byte < 62) {
          id += (byte - 26).toString(36).toUpperCase();
        } else if (byte > 62) {
          id += '-';
        } else {
          id += '_';
        }
        return id
      }, '');

    /* src/components/AddNoteForm.svelte generated by Svelte v3.55.1 */
    const file$4 = "src/components/AddNoteForm.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (49:12) {#each colors as color,i(color.id)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let colorbox;
    	let updating_selectedColor;
    	let current;

    	function colorbox_selectedColor_binding(value) {
    		/*colorbox_selectedColor_binding*/ ctx[7](value);
    	}

    	let colorbox_props = {
    		backGroundColor: /*color*/ ctx[12].backGroundColor
    	};

    	if (/*selectedColor*/ ctx[2] !== void 0) {
    		colorbox_props.selectedColor = /*selectedColor*/ ctx[2];
    	}

    	colorbox = new ColorBox({ props: colorbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorbox, 'selectedColor', colorbox_selectedColor_binding));

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(colorbox.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(colorbox, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const colorbox_changes = {};

    			if (!updating_selectedColor && dirty & /*selectedColor*/ 4) {
    				updating_selectedColor = true;
    				colorbox_changes.selectedColor = /*selectedColor*/ ctx[2];
    				add_flush_callback(() => updating_selectedColor = false);
    			}

    			colorbox.$set(colorbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colorbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colorbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(colorbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(49:12) {#each colors as color,i(color.id)}",
    		ctx
    	});

    	return block;
    }

    // (54:12) <Button  on:click={modalClose} >
    function create_default_slot_1(ctx) {
    	let t_value = addForm.cancelButton + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(54:12) <Button  on:click={modalClose} >",
    		ctx
    	});

    	return block;
    }

    // (55:12) <Button className="add">
    function create_default_slot(ctx) {
    	let t_value = addForm.addButton + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(55:12) <Button className=\\\"add\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let form;
    	let div0;
    	let input;
    	let t0;
    	let div1;
    	let textarea;
    	let t1;
    	let div2;
    	let p;
    	let t3;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t4;
    	let div3;
    	let button0;
    	let t5;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = colors;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*color*/ ctx[12].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*modalClose*/ ctx[3]);

    	button1 = new Button({
    			props: {
    				className: "add",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			div1 = element("div");
    			textarea = element("textarea");
    			t1 = space();
    			div2 = element("div");
    			p = element("p");
    			p.textContent = `${addForm.background}`;
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div3 = element("div");
    			create_component(button0.$$.fragment);
    			t5 = space();
    			create_component(button1.$$.fragment);
    			attr_dev(input, "type", "text");
    			input.required = true;
    			attr_dev(input, "placeholder", addForm.headingPlaceHolder);
    			attr_dev(input, "class", "svelte-wqvxyx");
    			add_location(input, file$4, 41, 12, 1238);
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$4, 40, 8, 1204);
    			attr_dev(textarea, "name", "content");
    			textarea.required = true;
    			attr_dev(textarea, "id", "");
    			attr_dev(textarea, "cols", addForm.contentCols);
    			attr_dev(textarea, "placeholder", addForm.contentPlaceHolder);
    			attr_dev(textarea, "rows", addForm.contentCols);
    			attr_dev(textarea, "class", "svelte-wqvxyx");
    			add_location(textarea, file$4, 44, 12, 1384);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file$4, 43, 8, 1350);
    			attr_dev(p, "class", "svelte-wqvxyx");
    			add_location(p, file$4, 47, 12, 1608);
    			attr_dev(div2, "class", "footer svelte-wqvxyx");
    			add_location(div2, file$4, 46, 8, 1575);
    			attr_dev(div3, "class", "button svelte-wqvxyx");
    			add_location(div3, file$4, 52, 8, 1834);
    			attr_dev(form, "class", "form svelte-wqvxyx");
    			attr_dev(form, "action", "");
    			add_location(form, file$4, 39, 4, 1131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*title*/ ctx[0]);
    			append_dev(form, t0);
    			append_dev(form, div1);
    			append_dev(div1, textarea);
    			set_input_value(textarea, /*content*/ ctx[1]);
    			append_dev(form, t1);
    			append_dev(form, div2);
    			append_dev(div2, p);
    			append_dev(div2, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(form, t4);
    			append_dev(form, div3);
    			mount_component(button0, div3, null);
    			append_dev(div3, t5);
    			mount_component(button1, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[6]),
    					listen_dev(form, "submit", prevent_default(/*addCard*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1 && input.value !== /*title*/ ctx[0]) {
    				set_input_value(input, /*title*/ ctx[0]);
    			}

    			if (dirty & /*content*/ 2) {
    				set_input_value(textarea, /*content*/ ctx[1]);
    			}

    			if (dirty & /*colors, selectedColor*/ 4) {
    				each_value = colors;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div2, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}

    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddNoteForm', slots, []);
    	const dispatch = createEventDispatcher();
    	let allNotes = get_store_value(notes);
    	let id = nanoid();
    	let title = "";
    	let content = "";
    	let selectedColor = colors[0].backGroundColor;
    	const options = { month: "short" };

    	function modalClose() {
    		dispatch("closeModal");
    	}

    	function addCard(event) {
    		var date = new Date();
    		let createdBy = date.getDate() + " " + date.toLocaleString('default', options);

    		notes.update(notes => {
    			return [
    				{
    					id,
    					title,
    					content,
    					backGroundColor: selectedColor,
    					creationDate: createdBy
    				},
    				...notes
    			];
    		});

    		dispatch("closeModal");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddNoteForm> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		title = this.value;
    		$$invalidate(0, title);
    	}

    	function textarea_input_handler() {
    		content = this.value;
    		$$invalidate(1, content);
    	}

    	function colorbox_selectedColor_binding(value) {
    		selectedColor = value;
    		$$invalidate(2, selectedColor);
    	}

    	$$self.$capture_state = () => ({
    		ColorBox,
    		notes,
    		each,
    		get: get_store_value,
    		createEventDispatcher,
    		addForm,
    		colors,
    		nanoid,
    		Button,
    		dispatch,
    		allNotes,
    		id,
    		title,
    		content,
    		selectedColor,
    		options,
    		modalClose,
    		addCard
    	});

    	$$self.$inject_state = $$props => {
    		if ('allNotes' in $$props) allNotes = $$props.allNotes;
    		if ('id' in $$props) id = $$props.id;
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('content' in $$props) $$invalidate(1, content = $$props.content);
    		if ('selectedColor' in $$props) $$invalidate(2, selectedColor = $$props.selectedColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		content,
    		selectedColor,
    		modalClose,
    		addCard,
    		input_input_handler,
    		textarea_input_handler,
    		colorbox_selectedColor_binding
    	];
    }

    class AddNoteForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddNoteForm",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/AddNotes.svelte generated by Svelte v3.55.1 */
    const file$3 = "src/components/AddNotes.svelte";

    // (33:0) {#if popup}
    function create_if_block(ctx) {
    	let backdrop;
    	let current;

    	backdrop = new Modal({
    			props: {
    				title: "new note",
    				$$slots: { content: [create_content_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	backdrop.$on("closeModal", /*toggleModal*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(backdrop.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(backdrop, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const backdrop_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				backdrop_changes.$$scope = { dirty, ctx };
    			}

    			backdrop.$set(backdrop_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(backdrop.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(backdrop.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(backdrop, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(33:0) {#if popup}",
    		ctx
    	});

    	return block;
    }

    // (35:8) 
    function create_content_slot(ctx) {
    	let addnoteform;
    	let current;

    	addnoteform = new AddNoteForm({
    			props: { slot: "content" },
    			$$inline: true
    		});

    	addnoteform.$on("closeModal", /*toggleModal*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(addnoteform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(addnoteform, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addnoteform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addnoteform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(addnoteform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(35:8) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let button;
    	let div;
    	let ion_icon;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*popup*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			div = element("div");
    			ion_icon = element("ion-icon");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_custom_element_data(ion_icon, "name", "add-circle");
    			add_location(ion_icon, file$3, 30, 22, 1048);
    			attr_dev(div, "class", "plus svelte-1vm59bz");
    			add_location(div, file$3, 30, 4, 1030);
    			attr_dev(button, "class", "notes-card svelte-1vm59bz");
    			attr_dev(button, "style", /*cardColorStyle*/ ctx[1]);
    			add_location(button, file$3, 29, 0, 952);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div);
    			append_dev(div, ion_icon);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggleModal*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*cardColorStyle*/ 2) {
    				attr_dev(button, "style", /*cardColorStyle*/ ctx[1]);
    			}

    			if (/*popup*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*popup*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let cardColorStyle;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddNotes', slots, []);
    	let column = "5";
    	let cardHeight = cardDimensions.fiveColCardHeight;
    	let flexMargins = cardDimensions.fiveColFlexMargins;

    	layout.subscribe(col => {
    		$$invalidate(3, column = col);

    		if (col == "2") {
    			$$invalidate(4, cardHeight = cardDimensions.twoColCardHeight);
    			$$invalidate(5, flexMargins = cardDimensions.twoColFlexMargins);
    		} else {
    			$$invalidate(4, cardHeight = cardDimensions.fiveColCardHeight);
    			$$invalidate(5, flexMargins = cardDimensions.fiveColFlexMargins);
    		}
    	});

    	let popup = false;

    	let toggleModal = () => {
    		$$invalidate(0, popup = !popup);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddNotes> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		AddNoteForm,
    		BackDrop: Modal,
    		layout,
    		cardDimensions,
    		column,
    		cardHeight,
    		flexMargins,
    		popup,
    		toggleModal,
    		cardColorStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ('column' in $$props) $$invalidate(3, column = $$props.column);
    		if ('cardHeight' in $$props) $$invalidate(4, cardHeight = $$props.cardHeight);
    		if ('flexMargins' in $$props) $$invalidate(5, flexMargins = $$props.flexMargins);
    		if ('popup' in $$props) $$invalidate(0, popup = $$props.popup);
    		if ('toggleModal' in $$props) $$invalidate(2, toggleModal = $$props.toggleModal);
    		if ('cardColorStyle' in $$props) $$invalidate(1, cardColorStyle = $$props.cardColorStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*cardHeight, flexMargins, column*/ 56) {
    			$$invalidate(1, cardColorStyle = `--card-height:${cardHeight};
                        --margin-constant:${flexMargins};
                        --col:${column};`);
    		}
    	};

    	return [popup, cardColorStyle, toggleModal, column, cardHeight, flexMargins];
    }

    class AddNotes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddNotes",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.55.1 */
    const file$2 = "src/components/Header.svelte";

    function create_fragment$2(ctx) {
    	let header_1;
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let t3;
    	let select;
    	let option0;
    	let t4_value = header.fiveColumn + "";
    	let t4;
    	let option1;
    	let t5_value = header.twoColumn + "";
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header_1 = element("header");
    			div0 = element("div");
    			div0.textContent = `${header.title}`;
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = `${header.defaultView}`;
    			t3 = space();
    			select = element("select");
    			option0 = element("option");
    			t4 = text(t4_value);
    			option1 = element("option");
    			t5 = text(t5_value);
    			attr_dev(div0, "class", "left svelte-llh68z");
    			add_location(div0, file$2, 16, 4, 283);
    			attr_dev(div1, "class", "default svelte-llh68z");
    			add_location(div1, file$2, 18, 8, 354);
    			option0.__value = header.fiveColumnValue;
    			option0.value = option0.__value;
    			add_location(option0, file$2, 20, 12, 505);
    			option1.__value = header.twoColumnValue;
    			option1.value = option1.__value;
    			add_location(option1, file$2, 21, 12, 585);
    			attr_dev(select, "class", "dropdown svelte-llh68z");
    			attr_dev(select, "name", "dropdown");
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[2].call(select));
    			add_location(select, file$2, 19, 8, 410);
    			attr_dev(div2, "class", "right svelte-llh68z");
    			add_location(div2, file$2, 17, 4, 326);
    			attr_dev(header_1, "class", "head svelte-llh68z");
    			add_location(header_1, file$2, 15, 0, 257);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header_1, anchor);
    			append_dev(header_1, div0);
    			append_dev(header_1, t1);
    			append_dev(header_1, div2);
    			append_dev(div2, div1);
    			append_dev(div2, t3);
    			append_dev(div2, select);
    			append_dev(select, option0);
    			append_dev(option0, t4);
    			append_dev(select, option1);
    			append_dev(option1, t5);
    			select_option(select, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[2]),
    					listen_dev(select, "change", /*setLayout*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value, header*/ 1) {
    				select_option(select, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header_1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let value = "";

    	layout.subscribe(val => {
    		$$invalidate(0, value = val);
    	});

    	function setLayout() {
    		layout.set(value);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(0, value);
    	}

    	$$self.$capture_state = () => ({ layout, header, value, setLayout });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, setLayout, select_change_handler];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/index.svelte generated by Svelte v3.55.1 */
    const file$1 = "src/pages/index.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (15:2) {#each $notes as note,i(note.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let notescard;
    	let current;

    	notescard = new NotesCard({
    			props: {
    				id: /*note*/ ctx[1].id,
    				title: /*note*/ ctx[1].title,
    				content: /*note*/ ctx[1].content,
    				creationDate: /*note*/ ctx[1].creationDate,
    				backGroundColor: /*note*/ ctx[1].backGroundColor
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(notescard.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(notescard, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const notescard_changes = {};
    			if (dirty & /*$notes*/ 1) notescard_changes.id = /*note*/ ctx[1].id;
    			if (dirty & /*$notes*/ 1) notescard_changes.title = /*note*/ ctx[1].title;
    			if (dirty & /*$notes*/ 1) notescard_changes.content = /*note*/ ctx[1].content;
    			if (dirty & /*$notes*/ 1) notescard_changes.creationDate = /*note*/ ctx[1].creationDate;
    			if (dirty & /*$notes*/ 1) notescard_changes.backGroundColor = /*note*/ ctx[1].backGroundColor;
    			notescard.$set(notescard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notescard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notescard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(notescard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:2) {#each $notes as note,i(note.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let link0;
    	let t0;
    	let link1;
    	let t1;
    	let link2;
    	let t2;
    	let header;
    	let t3;
    	let div0;
    	let addnotes;
    	let t4;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t5;
    	let script0;
    	let script0_src_value;
    	let t6;
    	let script1;
    	let script1_src_value;
    	let current;
    	header = new Header({ $$inline: true });
    	addnotes = new AddNotes({ $$inline: true });
    	let each_value = /*$notes*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*note*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			link0 = element("link");
    			t0 = space();
    			link1 = element("link");
    			t1 = space();
    			link2 = element("link");
    			t2 = space();
    			create_component(header.$$.fragment);
    			t3 = space();
    			div0 = element("div");
    			create_component(addnotes.$$.fragment);
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			script0 = element("script");
    			t6 = space();
    			script1 = element("script");
    			attr_dev(link0, "rel", "preconnect");
    			attr_dev(link0, "href", "https://fonts.googleapis.com");
    			add_location(link0, file$1, 8, 1, 233);
    			attr_dev(link1, "rel", "preconnect");
    			attr_dev(link1, "href", "https://fonts.gstatic.com");
    			attr_dev(link1, "crossorigin", "");
    			add_location(link1, file$1, 9, 1, 294);
    			attr_dev(link2, "href", "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&family=Varela+Round&display=swap");
    			attr_dev(link2, "rel", "stylesheet");
    			add_location(link2, file$1, 10, 1, 364);
    			attr_dev(div0, "class", "notes-container svelte-3kj02k");
    			add_location(div0, file$1, 12, 1, 520);
    			attr_dev(script0, "type", "module");
    			if (!src_url_equal(script0.src, script0_src_value = "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$1, 18, 1, 763);
    			script1.noModule = true;
    			if (!src_url_equal(script1.src, script1_src_value = "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$1, 19, 1, 865);
    			add_location(div1, file$1, 7, 0, 226);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, link0);
    			append_dev(div1, t0);
    			append_dev(div1, link1);
    			append_dev(div1, t1);
    			append_dev(div1, link2);
    			append_dev(div1, t2);
    			mount_component(header, div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			mount_component(addnotes, div0, null);
    			append_dev(div0, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t5);
    			append_dev(div1, script0);
    			append_dev(div1, t6);
    			append_dev(div1, script1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$notes*/ 1) {
    				each_value = /*$notes*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(addnotes.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(addnotes.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(header);
    			destroy_component(addnotes);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $notes;
    	validate_store(notes, 'notes');
    	component_subscribe($$self, notes, $$value => $$invalidate(0, $notes = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pages', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pages> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		NotesCard,
    		AddNotes,
    		Header,
    		notes,
    		$notes
    	});

    	return [$notes];
    }

    class Pages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pages",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.55.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let index;
    	let current;
    	index = new Pages({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(index.$$.fragment);
    			add_location(main, file, 3, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(index, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(index.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(index.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(index);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Index: Pages });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
