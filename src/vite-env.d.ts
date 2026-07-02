/// <reference types="vite/client" />

// NYSDS stylesheet entry points are CSS side-effect imports without .css suffix,
// so the vite/client *.css ambient does not cover them.
declare module "@nysds/styles/full";
declare module "@nysds/styles/typography";
