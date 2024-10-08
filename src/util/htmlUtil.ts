export const removeHtmlTag = (html: string, tagName: string): string => {
    const regex = new RegExp(`<${tagName}[^>]*>(.*?)<\/${tagName}>`, 'gi');
    return html.replace(regex, (_, innerContent) => innerContent);
}

export const removeHtmlTags = (html: string, tagNames: string[]): string => {
    for (let tagName of tagNames) {
        html = removeHtmlTag(html, tagName);
    }
    return html
}

export const cleanHtml = (html: string, preserveTags: string[], removeAttrs: boolean): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    function cleanNode(node: Node): Node | null {

        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (preserveTags.includes(element.tagName.toLowerCase())) {
                const textContent = element.textContent?.trim() || "";
                if (!textContent) {
                    return null;
                }
                if (removeAttrs) {
                    while (element.attributes.length > 0) {
                        element.removeAttribute(element.attributes[0].name);
                    }
                }
                element.innerHTML = textContent;
                return element;
            } else {
                const fragment = document.createDocumentFragment();
                while (element.firstChild) {
                    const childNode = element.removeChild(element.firstChild);
                    const cleanedChild = cleanNode(childNode);
                    if (cleanedChild) {
                        fragment.appendChild(cleanedChild);
                    }
                }
                return fragment;
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            return node;
        }
        return null;
    }

    const cleanedContent = cleanNode(doc.body);
    const resultContainer = document.createElement('div');
    if (cleanedContent) {
        resultContainer.appendChild(cleanedContent);
    }
    return resultContainer.innerHTML;
}