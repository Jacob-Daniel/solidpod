declare module "@rdfjs/namespace" {
  type NamespaceFunction = (term: string) => string;

  interface Namespace {
    (term: string): string;
  }

  function namespace(base: string): Namespace;

  export default namespace;
}
