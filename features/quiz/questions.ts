import { z } from "zod";

const questionSchema = z.object({
  id: z.string().min(1),
  hanzi: z.string().min(1),
  pinyin: z.string().min(1),
  meaning: z.string().min(1),
  prompt: z.string().min(1),
  choices: z.array(z.string().min(1)).length(4),
  hintPosition: z.enum(["left top", "right top", "left bottom", "right bottom"]),
});

export type QuizQuestion = z.infer<typeof questionSchema>;

export const questions = questionSchema.array().min(1).parse([
  { id: "greeting-hello", hanzi: "你好", pinyin: "nǐ hǎo", meaning: "hello", prompt: "Which greeting fits this friendly wave?", choices: ["你好", "谢谢", "再见", "对不起"], hintPosition: "left top" },
  { id: "noun-water", hanzi: "水", pinyin: "shuǐ", meaning: "water", prompt: "What is the person asking for?", choices: ["茶", "水", "米饭", "牛奶"], hintPosition: "right top" },
  { id: "animal-cat", hanzi: "猫", pinyin: "māo", meaning: "cat", prompt: "Name the animal in the hint.", choices: ["狗", "鸟", "猫", "鱼"], hintPosition: "left bottom" },
  { id: "verb-eat", hanzi: "吃", pinyin: "chī", meaning: "to eat", prompt: "What action does the hint show?", choices: ["喝", "吃", "看", "去"], hintPosition: "right bottom" },
]);
