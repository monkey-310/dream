export const QuestionUtils = {
  replaceMathExpressions: (
    str: string,
    mathExpressions: { [key: string]: { unicode: string; latex: string } },
    mode: "unicode" | "latex" = "latex"
  ): string => {
    return str.replace(/{{(.*?)}}/g, (_, key: string) => {
      if (mode === "unicode") return mathExpressions[key]?.unicode;
      return `** ${mathExpressions[key.trim()]?.latex} **`;
    });
  },
};
