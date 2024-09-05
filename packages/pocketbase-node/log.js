const replacer = (k, v) => {
  if (v instanceof Error) {
    return v.stack
  }
  if (v instanceof RegExp) {
    return v.toString()
  }
  if (v instanceof Function) {
    return v.toString()
  }
  return v
}

const { stringify } = require('./stringify')

const prepare = (objs) => {
  const parts = objs.map((o) => {
    if (o instanceof Error) {
      return o.stack
    }
    if (o instanceof RegExp) {
      return o.toString()
    }
    if (o instanceof Function) {
      return o.toString()
    }
    if (typeof o === 'object') {
      return stringify(o, replacer, 2)
    }
    return o
  })
  return parts.join(` `)
}

const dbg = (...objs) => {
  const s = prepare(objs)
  $app.logger().debug(s)
}

const info = (...objs) => {
  const s = prepare(objs)
  $app.logger().info(s)
}

const warn = (...objs) => {
  const s = prepare(objs)
  $app.logger().warn(s)
}

const error = (...objs) => {
  const s = prepare(objs)
  $app.logger().error(s)
}

module.exports = { dbg, info, warn, error, stringify }
