
import logger from 'slate-dev-logger'
import { Stack } from 'slate'

/**
 * Event handlers that can be simulated.
 *
 * @type {Array}
 */

const EVENT_HANDLERS = [
  'onBeforeInput',
  'onBlur',
  'onCopy',
  'onCut',
  'onDrop',
  'onFocus',
  'onKeyDown',
  'onPaste',
  'onSelect',
]

/**
 * Simulator.
 *
 * @type {Simulator}
 */

class Simulator {

  /**
   * Create a new `Simulator` with `plugins` and an initial `value`.
   *
   * @param {Object} attrs
   */

  constructor(props) {
    const { plugins, value } = props
    const stack = new Stack({ plugins })
    this.props = props
    this.stack = stack
    this.value = value

    Object.defineProperty(this, 'state', {
      get() {
        logger.deprecate('slate-simulator@0.3.0', 'The `simulator.state` property has been renamed to `simulator.value`.')
        return this.value
      }
    })

    if (props.state) {
      logger.deprecate('slate-simulator@0.3.0', 'The `state` prop has been renamed to `value`.')
      this.value = props.state
    }
  }

}

/**
 * Generate the event simulators.
 */

EVENT_HANDLERS.forEach((handler) => {
  const method = getMethodName(handler)

  Simulator.prototype[method] = function (e) {
    if (e == null) e = {}

    const { stack, value } = this
    const editor = createEditor(this)
    const event = createEvent(e)
    const change = value.change()

    stack.run(handler, change, editor, event)
    stack.run('onChange', change, editor)

    this.value = change.value
    return this
  }
})

/**
 * Get the method name from a `handler` name.
 *
 * @param {String} handler
 * @return {String}
 */

function getMethodName(handler) {
  return handler.charAt(2).toLowerCase() + handler.slice(3)
}

/**
 * Create a fake editor from a `stack` and `value`.
 *
 * @param {Stack} stack
 * @param {Value} value
 */

function createEditor({ stack, value, props }) {
  const editor = {
    getSchema: () => stack.schema,
    getState: () => value,
    props: {
      autoCorrect: true,
      autoFocus: false,
      onChange: () => {},
      readOnly: false,
      spellCheck: true,
      ...props,

    },
  }

  return editor
}

/**
 * Create a fake event with `attributes`.
 *
 * @param {Object} attributes
 * @return {Object}
 */

function createEvent(attributes) {
  const event = {
    preventDefault: () => event.isDefaultPrevented = true,
    stopPropagation: () => event.isPropagationStopped = true,
    isDefaultPrevented: false,
    isPropagationStopped: false,
    ...attributes,
  }

  return event
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Simulator