import { LoaderPinwheel, SendHorizonal } from "lucide-react";
import { Button } from "./components/ui/button";
import axios from "axios";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Textarea } from "./components/ui/textarea";
import showdown from "showdown";
import { motion } from "framer-motion";

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const converter = new showdown.Converter();

  useEffect(() => {
    const focusTextarea = (_evt: globalThis.KeyboardEvent) => {
      if (document.activeElement !== textareaRef?.current)
        textareaRef.current?.focus();
    };

    document.addEventListener("keydown", focusTextarea);

    return () => document.removeEventListener("keydown", focusTextarea);
  });

  useEffect(() => {
    if (!answer) return;
    let index = 0;
    const plain = answer;

    const interval = setInterval(() => {
      setDisplayedAnswer(plain.slice(0, index++));
      if (index > plain.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [answer]);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [question]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !loading) {
        formRef.current?.requestSubmit();
      }
    }
  };

  const ask = async (e: FormEvent<HTMLFormElement>) => {
    if (!question.trim()) return;
    e.preventDefault();
    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/ask", { question });
      setAnswer(converter.makeHtml(res.data.answer));
    } catch (err) {
      setDisplayedAnswer("");
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-font min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center">
        Ask me anything
      </h1>
      <div className="flex flex-col items-center justify-center mt-10 sm:mt-16 md:mt-20 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl">
        <form ref={formRef} className="flex w-full items-center" onSubmit={ask}>
          <div className="relative w-full">
            <Textarea
              ref={textareaRef}
              className="m-1 p-3 w-full break-words overflow-hidden resize-none bg-black text-white border border-white rounded-md"
              style={{
                fontSize: "clamp(16px, 5vw, 20px)",
                wordBreak: "break-word",
                whiteSpace: "normal",
                minHeight: "60px",
              }}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="What would you like to ask me?"
              rows={1}
            />
            <div className="absolute bottom-1 right-3 text-xs text-gray-40 hidden lg:block xl:block">
              Press Shift+Enter to send
            </div>
          </div>
          <Button
            className="m-1 h-15 w-20 ml-2 sm:w-30 text-lg sm:text-xl cursor-pointer group transition-all duration-300"
            type="submit"
            disabled={loading || !question.trim()}
          >
            {loading ? (
              <LoaderPinwheel className="scale-150 sm:scale-200 animate-spin" />
            ) : (
              <>
                Ask
                <SendHorizonal className="scale-125 sm:scale-150 ml-1 transition-all duration-300 group-hover:ml-2" />
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 text-red-500 text-center w-full">
            {error}
          </div>
        )}

        {(answer || loading) && (
          <motion.div
            className="mt-4 sm:mt-6 p-4 sm:p-6 border-2 border-white rounded-lg w-full overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {loading ? (
              <div className="text-lg sm:text-xl whitespace-pre-wrap break-words">
                <span className="inline-block animate-pulse">T</span>
                <span
                  className="inline-block animate-pulse"
                  style={{ animationDelay: "0.1s" }}
                >
                  h
                </span>
                <span
                  className="inline-block animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                >
                  i
                </span>
                <span
                  className="inline-block animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                >
                  n
                </span>
                <span
                  className="inline-block animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                >
                  k
                </span>
                <span
                  className="inline-block animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                >
                  i
                </span>
                <span
                  className="inline-block animate-pulse"
                  style={{ animationDelay: "0.6s" }}
                >
                  n
                </span>
                <span
                  className="inline-block animate-pulse"
                  style={{ animationDelay: "0.7s" }}
                >
                  g
                </span>
                <span
                  className="inline-block animate-pulse"
                  style={{ animationDelay: "0.8s" }}
                >
                  .
                </span>
                <span
                  className="inline-block animate-pulse"
                  style={{ animationDelay: "0.9s" }}
                >
                  .
                </span>
                <span
                  className="inline-block animate-pulse"
                  style={{ animationDelay: "1s" }}
                >
                  .
                </span>
              </div>
            ) : (
              <div
                className="text-lg sm:text-xl whitespace-pre-wrap font-noto-sans break-words"
                style={{
                  animation: "fadeSlideIn 0.5s ease-out both",
                }}
                dangerouslySetInnerHTML={{ __html: displayedAnswer }}
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
