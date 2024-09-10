// ../../pocketbase-stringify/src/index.ts
var stringify = (obj, replacer2, space) => {
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

// src/pb_hooks/pocodex.pb.js
try {
  dbg(`pocodex bootstrap`);
  dbg(`loading CLI`);
  require("pocodex/dist/cli").Init();
  dbg("pocodex loaded");
} catch (e) {
  warn(`WARNING: pocodex not loaded: ${e}`);
  warn(e.stack);
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vcG9ja2V0YmFzZS1zdHJpbmdpZnkvc3JjL2luZGV4LnRzIiwgIi4uLy4uLy4uLy4uL3BvY2tldGJhc2UtbG9nL3NyYy9pbmRleC50cyIsICIuLi8uLi9zcmMvcGJfaG9va3MvcG9jb2RleC5wYi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGNvbnN0IHN0cmluZ2lmeSA9IChcbiAgb2JqOiBhbnksXG4gIHJlcGxhY2VyOiAoazogc3RyaW5nLCB2OiBhbnkpID0+IGFueSxcbiAgc3BhY2U6IG51bWJlclxuKSA9PiB7XG4gIGNvbnN0IHNlZW4gPSBuZXcgV2Vha1NldCgpXG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShcbiAgICBvYmosXG4gICAgKGssIHYpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdiA9PT0gJ29iamVjdCcgJiYgdiAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoc2Vlbi5oYXModikpIHtcbiAgICAgICAgICByZXR1cm4gcmVwbGFjZXIgPyByZXBsYWNlcihrLCBgW0NpcmN1bGFyXWApIDogYFtDaXJjdWxhcl1gXG4gICAgICAgIH1cbiAgICAgICAgc2Vlbi5hZGQodilcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXBsYWNlciA/IHJlcGxhY2VyKGssIHYpIDogdlxuICAgIH0sXG4gICAgc3BhY2VcbiAgKVxufVxuIiwgIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9qc3ZtLmQudHNcIiAvPlxuXG5pbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tICdwb2NrZXRiYXNlLXN0cmluZ2lmeSdcblxuY29uc3QgcmVwbGFjZXIgPSAoazogc3RyaW5nLCB2OiBhbnkpID0+IHtcbiAgaWYgKHYgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHJldHVybiB2LnN0YWNrXG4gIH1cbiAgaWYgKHYgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gdi50b1N0cmluZygpXG4gIH1cbiAgaWYgKHYgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiB2LnRvU3RyaW5nKClcbiAgfVxuICByZXR1cm4gdlxufVxuXG5jb25zdCBwcmVwYXJlID0gKG9ianM6IGFueVtdKSA9PiB7XG4gIGNvbnN0IHBhcnRzID0gb2Jqcy5tYXAoKG8pID0+IHtcbiAgICBpZiAobyBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4gby5zdGFja1xuICAgIH1cbiAgICBpZiAobyBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgcmV0dXJuIG8udG9TdHJpbmcoKVxuICAgIH1cbiAgICBpZiAobyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gby50b1N0cmluZygpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBzdHJpbmdpZnkobywgcmVwbGFjZXIsIDIpXG4gICAgfVxuICAgIHJldHVybiBvXG4gIH0pXG4gIHJldHVybiBwYXJ0cy5qb2luKGAgYClcbn1cblxuY29uc3QgZGJnID0gKC4uLm9ianM6IGFueVtdKSA9PiB7XG4gIGNvbnN0IHMgPSBwcmVwYXJlKG9ianMpXG4gICRhcHAubG9nZ2VyKCkuZGVidWcocylcbn1cblxuY29uc3QgaW5mbyA9ICguLi5vYmpzOiBhbnlbXSkgPT4ge1xuICBjb25zdCBzID0gcHJlcGFyZShvYmpzKVxuICAkYXBwLmxvZ2dlcigpLmluZm8ocylcbn1cblxuY29uc3Qgd2FybiA9ICguLi5vYmpzOiBhbnlbXSkgPT4ge1xuICBjb25zdCBzID0gcHJlcGFyZShvYmpzKVxuICAkYXBwLmxvZ2dlcigpLndhcm4ocylcbn1cblxuY29uc3QgZXJyb3IgPSAoLi4ub2JqczogYW55W10pID0+IHtcbiAgY29uc3QgcyA9IHByZXBhcmUob2JqcylcbiAgJGFwcC5sb2dnZXIoKS5lcnJvcihzKVxufVxuXG5leHBvcnQgeyBkYmcsIGluZm8sIHdhcm4sIGVycm9yIH1cbiIsICJpbXBvcnQgeyBlcnJvciwgZGJnLCB3YXJuIH0gZnJvbSAncG9ja2V0YmFzZS1sb2cnXG50cnkge1xuICBkYmcoYHBvY29kZXggYm9vdHN0cmFwYClcbiAgZGJnKGBsb2FkaW5nIENMSWApXG4gIHJlcXVpcmUoJ3BvY29kZXgvZGlzdC9jbGknKS5Jbml0KClcbiAgZGJnKCdwb2NvZGV4IGxvYWRlZCcpXG59IGNhdGNoIChlKSB7XG4gIHdhcm4oYFdBUk5JTkc6IHBvY29kZXggbm90IGxvYWRlZDogJHtlfWApXG4gIHdhcm4oZS5zdGFjaylcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBTyxJQUFNLFlBQVksQ0FDdkIsS0FDQUEsV0FDQSxVQUNHO0FBQ0gsUUFBTSxPQUFPLG9CQUFJLFFBQVE7QUFDekIsU0FBTyxLQUFLO0FBQUEsSUFDVjtBQUFBLElBQ0EsQ0FBQyxHQUFHLE1BQU07QUFDUixVQUFJLE9BQU8sTUFBTSxZQUFZLE1BQU0sTUFBTTtBQUN2QyxZQUFJLEtBQUssSUFBSSxDQUFDLEdBQUc7QUFDZixpQkFBT0EsWUFBV0EsVUFBUyxHQUFHLFlBQVksSUFBSTtBQUFBLFFBQ2hEO0FBQ0EsYUFBSyxJQUFJLENBQUM7QUFBQSxNQUNaO0FBQ0EsYUFBT0EsWUFBV0EsVUFBUyxHQUFHLENBQUMsSUFBSTtBQUFBLElBQ3JDO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRjs7O0FDZkEsSUFBTSxXQUFXLENBQUMsR0FBVyxNQUFXO0FBQ3RDLE1BQUksYUFBYSxPQUFPO0FBQ3RCLFdBQU8sRUFBRTtBQUFBLEVBQ1g7QUFDQSxNQUFJLGFBQWEsUUFBUTtBQUN2QixXQUFPLEVBQUUsU0FBUztBQUFBLEVBQ3BCO0FBQ0EsTUFBSSxhQUFhLFVBQVU7QUFDekIsV0FBTyxFQUFFLFNBQVM7QUFBQSxFQUNwQjtBQUNBLFNBQU87QUFDVDtBQUVBLElBQU0sVUFBVSxDQUFDLFNBQWdCO0FBQy9CLFFBQU0sUUFBUSxLQUFLLElBQUksQ0FBQyxNQUFNO0FBQzVCLFFBQUksYUFBYSxPQUFPO0FBQ3RCLGFBQU8sRUFBRTtBQUFBLElBQ1g7QUFDQSxRQUFJLGFBQWEsUUFBUTtBQUN2QixhQUFPLEVBQUUsU0FBUztBQUFBLElBQ3BCO0FBQ0EsUUFBSSxhQUFhLFVBQVU7QUFDekIsYUFBTyxFQUFFLFNBQVM7QUFBQSxJQUNwQjtBQUNBLFFBQUksT0FBTyxNQUFNLFVBQVU7QUFDekIsYUFBTyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQUEsSUFDakM7QUFDQSxXQUFPO0FBQUEsRUFDVCxDQUFDO0FBQ0QsU0FBTyxNQUFNLEtBQUssR0FBRztBQUN2QjtBQUVBLElBQU0sTUFBTSxJQUFJLFNBQWdCO0FBQzlCLFFBQU0sSUFBSSxRQUFRLElBQUk7QUFDdEIsT0FBSyxPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQ3ZCO0FBT0EsSUFBTSxPQUFPLElBQUksU0FBZ0I7QUFDL0IsUUFBTSxJQUFJLFFBQVEsSUFBSTtBQUN0QixPQUFLLE9BQU8sRUFBRSxLQUFLLENBQUM7QUFDdEI7OztBQ2hEQSxJQUFJO0FBQ0YsTUFBSSxtQkFBbUI7QUFDdkIsTUFBSSxhQUFhO0FBQ2pCLFVBQVEsa0JBQWtCLEVBQUUsS0FBSztBQUNqQyxNQUFJLGdCQUFnQjtBQUN0QixTQUFTLEdBQUc7QUFDVixPQUFLLGdDQUFnQyxDQUFDLEVBQUU7QUFDeEMsT0FBSyxFQUFFLEtBQUs7QUFDZDsiLAogICJuYW1lcyI6IFsicmVwbGFjZXIiXQp9Cg==