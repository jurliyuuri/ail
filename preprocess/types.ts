export type Word = {
  entry: {
    id: number;
    form: string;
  }
  translations: {
    title: string;
    forms: string[];
  }[]
  tags: string[];
  contents: {
    title: string;
    text: string;
  }[]
  variations: {
    title: string,
    form: string,
  }[]
  relations: {
    title: string;
    entry: {
      id: number;
      form: string;
    }
  }[]
}