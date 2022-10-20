let store = {}
let componentMap = {}
let currentProps = {}
let currentID = 0
let nextID = 0
let storeID = 0

export function useStore(initial, key) {
  const props = currentProps
  const cid = currentID

  if (!key) key = `${cid}-${storeID++}`

  if (!store[key]) store[key] = initial

  const setStore = value => {
    store[key] = value

    console.log(store)
    console.log(cid, componentMap)

    render(componentMap[cid], props, true, false, cid)

    // add ability to rerender component by id
  }

  return [store[key], setStore]
}

export function render(origin, props, rerender, isChild, cid) {
  if (!origin) return

  const isComponent = typeof props?.a === 'function'

  if (isComponent) {
    currentProps = props
    storeID = 0
  }

  if (!rerender && isComponent) {
    currentID = nextID
  }

  if (rerender && isComponent) {
    currentID = cid
  }

  const created = createElement(props)
  let newElement = null

  if (rerender) {
    const parent = origin.parentNode
    const index = Array.prototype.indexOf.call(parent.children, origin)
    dispatchAll(origin, 'unmount')
    parent.replaceChild(created, origin)
    newElement = parent.children[index]
  }
  else {
    origin.append(created)
    newElement = origin.lastChild
  }

  if (isComponent) {
    componentMap[cid || nextID] = newElement
  }

  if (!rerender && isComponent) {
    nextID++
  }
  
  if (!isChild) dispatchAll(newElement, 'mount')
  return newElement
}

function dispatchAll(element, event) {
  element.dispatchEvent(new Event(event))
  element.querySelectorAll('*').forEach(e => e.dispatchEvent(new Event(event)))
}

function createElement(props) {
  if (props === undefined) return createFragment('')
  if (Array.isArray(props)) return wrapElements(props.map(createElement))
  if (typeof props !== 'object') return createFragment(props)

  const { a, c, ...atts } = props

  if (typeof a === 'function') return createElement(a({ c, ...atts }))

  let pureAtts = {}
  let listeners = {}

  Object.entries(atts).forEach(([key, value]) => key.startsWith('_') 
    ? listeners[key.substring(1)] = value 
    : pureAtts[key] = value)

  const newElement = createFragment(createHTML(a, pureAtts))

  Object.entries(listeners).forEach(([event, callback]) => Array.isArray(callback) 
    ? newElement.firstChild.addEventListener(event, e => callback.forEach(e))
    : newElement.firstChild.addEventListener(event, callback))

  Array.isArray(c)
    ? c.forEach(child => render(newElement.firstChild, child, false, true))
    : render(newElement.firstChild, c, false, true)

  return newElement
}

function wrapElements(elements) {
  const wrapper = createFragment('')
  wrapper.append(...elements)
  return wrapper
}

function createHTML(a, atts) {
  const tag = a || 'div'
  const attString = ([att, val]) => `${att.replaceAll('_', '-')}="${val}"`
  const attHTML = Object.entries(atts).filter(([_, val]) => val !== undefined).map(attString).join('')
  return `<${tag} ${attHTML}></${tag}>`
}

function createFragment(html) {
  return document.createRange().createContextualFragment(html)
}