export function getType(params: any, type: string) {
  return (
    Object.prototype.toString.call(params).slice(8, -1).toLowerCase() === type
  )
}

/**功能 - 深度复制
 */
export function extendDeep(item: any) {
  if (!item) {
    return item
  }

  const types = [Number, String, Boolean]
  let result

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach((type) => {
    if (item instanceof type) {
      result = type(item)
    }
  })

  if (typeof result === 'undefined') {
    if (getType(item, 'array')) {
      result = []
      item.forEach((child: any, index: number) => {
        result[index] = extendDeep(child)
      })
    } else if (getType(item, 'object')) {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode === 'function') {
        result = item.cloneNode(true)
      }
      // check that this is a literal
      // eslint-disable-next-line no-negated-condition
      else if (!item.prototype) {
        if (item instanceof Date) {
          result = new Date(item)
        } else if (item instanceof RegExp) {
          result = new RegExp(item.source, item.flags)
        } else {
          if (item.constructor && typeof item.constructor === 'function') {
            result = new item.constructor()
          } else {
            // it is an object literal
            result = {}
          }
          for (const i in item) {
            if ({}.hasOwnProperty.call(item, i)) {
              result[i] = extendDeep(item[i])
            }
          }
        }
      } else {
        result = item
      }
    } else {
      result = item
    }
  }

  return result
}

export class Utils {
  public static inRect(
    rect: [number, number, number, number],
    point: [number, number]
  ) {
    if (!rect || !point) {
      return false
    }
    return !(
      point[0] < rect[0] ||
      point[0] > rect[0] + rect[2] ||
      point[1] < rect[1] ||
      point[1] > rect[1] + rect[3]
    )
  }

  public static clamp(
    value: number,
    min: number | undefined = undefined,
    max: number | undefined = undefined
  ): number {
    if (min === undefined && max == undefined) {
      return value
    }

    if (min === undefined) {
      return value > max! ? max! : value
    }
    if (max === undefined) {
      return value < min! ? min! : value
    }

    return value < min ? min : value > max ? max : value
  }
}
