type Base64Url = string;

class UrlUtils {
  // From https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem.
  /** encode to base64Url hash */
  encodeToBase64Url(payload: unknown): Base64Url {
    const asJson = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const asByteArray = new TextEncoder().encode(asJson);
    return btoa(String.fromCodePoint(...asByteArray)).replace(/=+$/, '');
  }

  // From https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem.
  /** decode from base64Utl hash */
  decodeFromBase64Url(hashed: Base64Url): unknown {
    // @ts-ignore
    const asByteArray = Uint8Array.from(atob(hashed), (m) => m.codePointAt(0));
    const asString = new TextDecoder().decode(asByteArray);
    try {
      return JSON.parse(asString);
    } catch (e) {
      return asString;
    }
  }
}

export const urlUtils = new UrlUtils();
