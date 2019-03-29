/** Creates a deep clone of an element. */
export function deepCloneNode(node: HTMLElement): HTMLElement {
  const clone = node.cloneNode(true) as HTMLElement;
  // Remove the `id` to avoid having multiple elements with the same id on the page.
  clone.removeAttribute('id');
  return clone;
}

/**
 * Gets a 3d `transform` that can be applied to an element.
 * @param x Desired position of the element along the X axis.
 * @param y Desired position of the element along the Y axis.
 */
export function getTransform(x: number, y: number): string {
  // Round the transforms since some browsers will
  // blur the elements for sub-pixel transforms.
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}
