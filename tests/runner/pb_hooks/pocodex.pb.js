"use strict";

// ../../pocketbase-stringify/src/index.ts
var defaultReplacer = (k, v) => {
  if (v instanceof Error) {
    return v.stack;
  }
  if (v instanceof RegExp) {
    return v.toString();
  }
  if (v instanceof Function) {
    return v.toString();
  }
  return v;
};
var stringify = (obj, replacer2 = defaultReplacer, space = 0) => {
  const seen = /* @__PURE__ */ new WeakSet();
  return JSON.stringify(
    obj,
    (k, v) => {
      if (typeof v === "object" && v !== null) {
        if (seen.has(v)) {
          return replacer2 ? replacer2(k, `[Circular]`) : `[Circular]`;
        }
        seen.add(v);
      }
      return replacer2 ? replacer2(k, v) : v;
    },
    space
  );
};

// ../../pocketbase-log/src/index.ts
var replacer = (k, v) => {
  if (v instanceof Error) {
    return v.stack;
  }
  if (v instanceof RegExp) {
    return v.toString();
  }
  if (v instanceof Function) {
    return v.toString();
  }
  return v;
};
var prepare = (objs) => {
  const parts = objs.map((o) => {
    if (o instanceof Error) {
      return o.stack;
    }
    if (o instanceof RegExp) {
      return o.toString();
    }
    if (o instanceof Function) {
      return o.toString();
    }
    if (typeof o === "object") {
      return stringify(o, replacer, 2);
    }
    return o;
  });
  return parts.join(` `);
};
var dbg = (...objs) => {
  const s = prepare(objs);
  $app.logger().debug(s);
};
var warn = (...objs) => {
  const s = prepare(objs);
  $app.logger().warn(s);
};

// src/pb_hooks/pocodex.pb.ts
try {
  dbg(`pocodex bootstrap`);
  dbg(`loading CLI`);
  require("pocodex/dist/pb").Init();
  dbg("pocodex loaded");
} catch (e) {
  warn(`WARNING: pocodex not loaded: ${e}`);
  if (e instanceof Error) {
    warn(e.stack);
  }
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vcG9ja2V0YmFzZS1zdHJpbmdpZnkvc3JjL2luZGV4LnRzIiwgIi4uLy4uLy4uLy4uL3BvY2tldGJhc2UtbG9nL3NyYy9pbmRleC50cyIsICIuLi8uLi9zcmMvcGJfaG9va3MvcG9jb2RleC5wYi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGNvbnN0IGRlZmF1bHRSZXBsYWNlciA9IChrOiBzdHJpbmcsIHY6IGFueSkgPT4ge1xuICBpZiAodiBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuIHYuc3RhY2tcbiAgfVxuICBpZiAodiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiB2LnRvU3RyaW5nKClcbiAgfVxuICBpZiAodiBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoKVxuICB9XG4gIHJldHVybiB2XG59XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdpZnkgPSAob2JqOiBhbnksIHJlcGxhY2VyID0gZGVmYXVsdFJlcGxhY2VyLCBzcGFjZSA9IDApID0+IHtcbiAgY29uc3Qgc2VlbiA9IG5ldyBXZWFrU2V0KClcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxuICAgIG9iaixcbiAgICAoaywgdikgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB2ID09PSAnb2JqZWN0JyAmJiB2ICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChzZWVuLmhhcyh2KSkge1xuICAgICAgICAgIHJldHVybiByZXBsYWNlciA/IHJlcGxhY2VyKGssIGBbQ2lyY3VsYXJdYCkgOiBgW0NpcmN1bGFyXWBcbiAgICAgICAgfVxuICAgICAgICBzZWVuLmFkZCh2KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcGxhY2VyID8gcmVwbGFjZXIoaywgdikgOiB2XG4gICAgfSxcbiAgICBzcGFjZVxuICApXG59XG4iLCAiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2pzdm0uZC50c1wiIC8+XG5cbmltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gJ3BvY2tldGJhc2Utc3RyaW5naWZ5J1xuXG5jb25zdCByZXBsYWNlciA9IChrOiBzdHJpbmcsIHY6IGFueSkgPT4ge1xuICBpZiAodiBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuIHYuc3RhY2tcbiAgfVxuICBpZiAodiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiB2LnRvU3RyaW5nKClcbiAgfVxuICBpZiAodiBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoKVxuICB9XG4gIHJldHVybiB2XG59XG5cbmNvbnN0IHByZXBhcmUgPSAob2JqczogYW55W10pID0+IHtcbiAgY29uc3QgcGFydHMgPSBvYmpzLm1hcCgobykgPT4ge1xuICAgIGlmIChvIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiBvLnN0YWNrXG4gICAgfVxuICAgIGlmIChvIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICByZXR1cm4gby50b1N0cmluZygpXG4gICAgfVxuICAgIGlmIChvIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIHJldHVybiBvLnRvU3RyaW5nKClcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHN0cmluZ2lmeShvLCByZXBsYWNlciwgMilcbiAgICB9XG4gICAgcmV0dXJuIG9cbiAgfSlcbiAgcmV0dXJuIHBhcnRzLmpvaW4oYCBgKVxufVxuXG5jb25zdCBkYmcgPSAoLi4ub2JqczogYW55W10pID0+IHtcbiAgY29uc3QgcyA9IHByZXBhcmUob2JqcylcbiAgJGFwcC5sb2dnZXIoKS5kZWJ1ZyhzKVxufVxuXG5jb25zdCBpbmZvID0gKC4uLm9ianM6IGFueVtdKSA9PiB7XG4gIGNvbnN0IHMgPSBwcmVwYXJlKG9ianMpXG4gICRhcHAubG9nZ2VyKCkuaW5mbyhzKVxufVxuXG5jb25zdCB3YXJuID0gKC4uLm9ianM6IGFueVtdKSA9PiB7XG4gIGNvbnN0IHMgPSBwcmVwYXJlKG9ianMpXG4gICRhcHAubG9nZ2VyKCkud2FybihzKVxufVxuXG5jb25zdCBlcnJvciA9ICguLi5vYmpzOiBhbnlbXSkgPT4ge1xuICBjb25zdCBzID0gcHJlcGFyZShvYmpzKVxuICAkYXBwLmxvZ2dlcigpLmVycm9yKHMpXG59XG5cbmV4cG9ydCB7IGRiZywgaW5mbywgd2FybiwgZXJyb3IgfVxuIiwgImltcG9ydCB7IGRiZywgd2FybiB9IGZyb20gJ3BvY2tldGJhc2UtbG9nJ1xudHJ5IHtcbiAgZGJnKGBwb2NvZGV4IGJvb3RzdHJhcGApXG4gIGRiZyhgbG9hZGluZyBDTElgKVxuICByZXF1aXJlKCdwb2NvZGV4L2Rpc3QvcGInKS5Jbml0KClcbiAgZGJnKCdwb2NvZGV4IGxvYWRlZCcpXG59IGNhdGNoIChlKSB7XG4gIHdhcm4oYFdBUk5JTkc6IHBvY29kZXggbm90IGxvYWRlZDogJHtlfWApXG4gIGlmIChlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICB3YXJuKGUuc3RhY2spXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7OztBQUFPLElBQU0sa0JBQWtCLENBQUMsR0FBVyxNQUFXO0FBQ3BELE1BQUksYUFBYSxPQUFPO0FBQ3RCLFdBQU8sRUFBRTtBQUFBLEVBQ1g7QUFDQSxNQUFJLGFBQWEsUUFBUTtBQUN2QixXQUFPLEVBQUUsU0FBUztBQUFBLEVBQ3BCO0FBQ0EsTUFBSSxhQUFhLFVBQVU7QUFDekIsV0FBTyxFQUFFLFNBQVM7QUFBQSxFQUNwQjtBQUNBLFNBQU87QUFDVDtBQUVPLElBQU0sWUFBWSxDQUFDLEtBQVVBLFlBQVcsaUJBQWlCLFFBQVEsTUFBTTtBQUM1RSxRQUFNLE9BQU8sb0JBQUksUUFBUTtBQUN6QixTQUFPLEtBQUs7QUFBQSxJQUNWO0FBQUEsSUFDQSxDQUFDLEdBQUcsTUFBTTtBQUNSLFVBQUksT0FBTyxNQUFNLFlBQVksTUFBTSxNQUFNO0FBQ3ZDLFlBQUksS0FBSyxJQUFJLENBQUMsR0FBRztBQUNmLGlCQUFPQSxZQUFXQSxVQUFTLEdBQUcsWUFBWSxJQUFJO0FBQUEsUUFDaEQ7QUFDQSxhQUFLLElBQUksQ0FBQztBQUFBLE1BQ1o7QUFDQSxhQUFPQSxZQUFXQSxVQUFTLEdBQUcsQ0FBQyxJQUFJO0FBQUEsSUFDckM7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUNGOzs7QUN4QkEsSUFBTSxXQUFXLENBQUMsR0FBVyxNQUFXO0FBQ3RDLE1BQUksYUFBYSxPQUFPO0FBQ3RCLFdBQU8sRUFBRTtBQUFBLEVBQ1g7QUFDQSxNQUFJLGFBQWEsUUFBUTtBQUN2QixXQUFPLEVBQUUsU0FBUztBQUFBLEVBQ3BCO0FBQ0EsTUFBSSxhQUFhLFVBQVU7QUFDekIsV0FBTyxFQUFFLFNBQVM7QUFBQSxFQUNwQjtBQUNBLFNBQU87QUFDVDtBQUVBLElBQU0sVUFBVSxDQUFDLFNBQWdCO0FBQy9CLFFBQU0sUUFBUSxLQUFLLElBQUksQ0FBQyxNQUFNO0FBQzVCLFFBQUksYUFBYSxPQUFPO0FBQ3RCLGFBQU8sRUFBRTtBQUFBLElBQ1g7QUFDQSxRQUFJLGFBQWEsUUFBUTtBQUN2QixhQUFPLEVBQUUsU0FBUztBQUFBLElBQ3BCO0FBQ0EsUUFBSSxhQUFhLFVBQVU7QUFDekIsYUFBTyxFQUFFLFNBQVM7QUFBQSxJQUNwQjtBQUNBLFFBQUksT0FBTyxNQUFNLFVBQVU7QUFDekIsYUFBTyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQUEsSUFDakM7QUFDQSxXQUFPO0FBQUEsRUFDVCxDQUFDO0FBQ0QsU0FBTyxNQUFNLEtBQUssR0FBRztBQUN2QjtBQUVBLElBQU0sTUFBTSxJQUFJLFNBQWdCO0FBQzlCLFFBQU0sSUFBSSxRQUFRLElBQUk7QUFDdEIsT0FBSyxPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQ3ZCO0FBT0EsSUFBTSxPQUFPLElBQUksU0FBZ0I7QUFDL0IsUUFBTSxJQUFJLFFBQVEsSUFBSTtBQUN0QixPQUFLLE9BQU8sRUFBRSxLQUFLLENBQUM7QUFDdEI7OztBQ2hEQSxJQUFJO0FBQ0YsTUFBSSxtQkFBbUI7QUFDdkIsTUFBSSxhQUFhO0FBQ2pCLFVBQVEsaUJBQWlCLEVBQUUsS0FBSztBQUNoQyxNQUFJLGdCQUFnQjtBQUN0QixTQUFTLEdBQUc7QUFDVixPQUFLLGdDQUFnQyxDQUFDLEVBQUU7QUFDeEMsTUFBSSxhQUFhLE9BQU87QUFDdEIsU0FBSyxFQUFFLEtBQUs7QUFBQSxFQUNkO0FBQ0Y7IiwKICAibmFtZXMiOiBbInJlcGxhY2VyIl0KfQo=