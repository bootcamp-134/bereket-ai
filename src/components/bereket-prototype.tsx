"use client";

import {
  RiArrowUpLine,
  RiDeleteBin6Line,
  RiFileList3Line,
  RiFridgeLine,
  RiInformationLine,
  RiMoonLine,
  RiRestaurant2Line,
  RiShoppingBasket2Line,
  RiSunLine,
  RiWallet3Line,
} from "@remixicon/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Badge } from "@/components/ui/badge";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createMockPlan, currencyFormatter } from "@/lib/bereket-mock";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  isPlan?: boolean;
};

type EmptyStateCopy = {
  title: string;
  description: string;
};

type DemoPromptScenario = {
  answer: string;
  prompt: string;
};

const demoStatus = "Bereket AI, prototip sürümdedir ve gerçeği yansıtmaz.";

const fixedPlan = createMockPlan({
  budget: 900,
  customIngredients: [],
  days: 5,
  people: 5,
  priorityMode: "waste",
  prioritizeExpiring: true,
  selectedIngredients: [
    "Patates",
    "Soğan",
    "Tavuk",
    "Yoğurt",
    "Makarna",
    "Domates",
  ],
});

const planLines = fixedPlan.days.map((day) => `${day.day}. Gün: ${day.title}`);
const shoppingLines = fixedPlan.shoppingList.map(
  (item) => `- ${item.name}: ${currencyFormatter.format(item.price)}`,
);
const scoreLines = fixedPlan.scores.map(
  (score) => `- ${score.label}: ${score.value}/100`,
);

const emptyStateCopies: EmptyStateCopy[] = [
  {
    title: "Bugün ne pişirelim?",
    description:
      "Evdeki malzemelerinizi ve bütçenizi yazın; size en uygun yemek planını öğrenin.",
  },
  {
    title: "Dolaptakilerle ne çıkar?",
    description:
      "Mevcut malzemeleri, kişi sayısını ve bütçeyi paylaşın; israfı azaltan bir plan görün.",
  },
  {
    title: "Bütçeyi aşmadan ne pişer?",
    description:
      "Kilerinizde olanları yazın; düşük ek alışverişle 5 günlük örnek akış oluşturulsun.",
  },
  {
    title: "İsraf etmeden planlayalım mı?",
    description:
      "Bozulma riski yüksek ürünleri öne alan, prototip veriye dayalı yemek önerilerini deneyin.",
  },
];

const demoPromptScenarios: DemoPromptScenario[] = [
  {
    answer: [
      "Elbette. Elinizdeki tavuk, yoğurt, patates, makarna ve domatesi merkeze alarak 5 günlük ekonomik bir akış hazırladım.",
      "",
      "Yemek planı",
      ...planLines,
      "",
      "Eksik alışveriş listesi",
      ...shoppingLines,
      "",
      `Toplam tahmini ek alışveriş maliyeti: ${currencyFormatter.format(fixedPlan.totalCost)}`,
      "",
      "Neden bu plan?",
      "Tavuk ve yoğurt ilk günlere alındı; makarna ve patates gibi dayanıklı ürünler planın maliyetini dengede tutmak için sonraki günlere yayıldı.",
      "",
      "Basit skorlar",
      ...scoreLines,
    ].join("\n"),
    prompt:
      "Evde tavuk, yoğurt, patates, makarna ve domates var; 900 TL ile 5 günlük plan yap.",
  },
  {
    answer: [
      "Önceliği bozulabilecek ürünlere verdim. Bu örnek planda tavuk ve yoğurt bekletilmeden kullanılıyor, kalan günler daha dayanıklı kiler ürünleriyle tamamlanıyor.",
      "",
      "Yemek planı",
      ...planLines,
      "",
      "Öncelikli kullanım notu",
      "- Tavuk: 1. ve 4. gün",
      "- Yoğurt: 2. gün",
      "- Domates: 3. ve 5. gün",
      "",
      "Eksik alışveriş listesi",
      ...shoppingLines,
      "",
      `Toplam tahmini ek alışveriş maliyeti: ${currencyFormatter.format(fixedPlan.totalCost)}`,
      "",
      "İsrafı azaltma açıklaması",
      fixedPlan.explanation,
      "",
      "Basit skorlar",
      ...scoreLines,
    ].join("\n"),
    prompt:
      "Bozulabilecek tavuk ve yoğurdu önce kullanıp israfı azaltan bir menü öner.",
  },
  {
    answer: [
      "900 TL sınırını aşmadan, ek alışverişi yalnızca tamamlayıcı ürünlerle sınırlayan bir öneri hazırladım. Ana yük evdeki malzemelerde kalıyor.",
      "",
      "Yemek planı",
      ...planLines,
      "",
      "Bütçeyi etkileyen eksikler",
      ...shoppingLines,
      "",
      `Tahmini ek maliyet: ${currencyFormatter.format(fixedPlan.totalCost)}`,
      "Bütçe sonucu: 900 TL içinde kalır.",
      "",
      "Neden bu plan?",
      "Protein ve süt ürünü erken tüketiliyor; makarna, patates ve domates ise öğün sayısını artırarak ek alışveriş ihtiyacını düşük tutuyor.",
      "",
      "Basit skorlar",
      ...scoreLines,
    ].join("\n"),
    prompt:
      "3 kişilik aile için eksik alışverişi düşük tutan ekonomik yemek planı çıkar.",
  },
];

function getRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

function shuffleItems<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

const scoreChartConfig = {
  budget: {
    color: "var(--chart-1)",
    label: "Bütçe Uyumu",
  },
  pantry: {
    color: "var(--chart-3)",
    label: "Kiler Kullanımı",
  },
  score: {
    color: "var(--chart-1)",
    label: "Skor",
  },
  waste: {
    color: "var(--chart-2)",
    label: "İsraf Azaltma",
  },
} satisfies ChartConfig;

const scoreChartData = fixedPlan.scores.map((score) => ({
  fill: `var(--color-${score.key})`,
  key: score.key,
  metric:
    score.key === "budget"
      ? "Bütçe"
      : score.key === "waste"
        ? "İsraf"
        : "Kiler",
  score: score.value,
}));

export function BereketPrototype() {
  const { resolvedTheme, setTheme } = useTheme();
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isClearDialogOpen, setIsClearDialogOpen] = React.useState(false);
  const [isThemeReady, setIsThemeReady] = React.useState(false);
  const [emptyStateCopy, setEmptyStateCopy] = React.useState<EmptyStateCopy>(
    emptyStateCopies[0],
  );
  const [promptScenarios, setPromptScenarios] =
    React.useState<DemoPromptScenario[]>(demoPromptScenarios);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const messageCounterRef = React.useRef(0);
  const timeoutRef = React.useRef<number | null>(null);
  const intervalRef = React.useRef<number | null>(null);

  const clearResponseTimers = React.useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    setIsThemeReady(true);
    setEmptyStateCopy(getRandomItem(emptyStateCopies));
    setPromptScenarios(shuffleItems(demoPromptScenarios));

    if (window.matchMedia("(pointer: fine)").matches) {
      textareaRef.current?.focus();
    }

    return () => {
      clearResponseTimers();
    };
  }, [clearResponseTimers]);

  React.useEffect(() => {
    const hasDraft = input.trim().length > 0 || messages.length > 0;

    if (!hasDraft) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [input, messages.length]);

  function nextId(prefix: string) {
    messageCounterRef.current += 1;
    return `${prefix}-${messageCounterRef.current}`;
  }

  function confirmClearConversation() {
    clearResponseTimers();
    setInput("");
    setMessages([]);
    setIsStreaming(false);
    setError("");
    setEmptyStateCopy(getRandomItem(emptyStateCopies));
    setPromptScenarios(shuffleItems(demoPromptScenarios));
    setIsClearDialogOpen(false);
    toast.success("Sohbet temizlendi");
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function toggleTheme() {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }

  function getRandomAssistantAnswer() {
    const randomIndex = Math.floor(Math.random() * demoPromptScenarios.length);
    return (
      demoPromptScenarios[randomIndex]?.answer ?? demoPromptScenarios[0].answer
    );
  }

  function streamAssistantAnswer(assistantId: string, answer: string) {
    let cursor = 0;

    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        cursor = Math.min(cursor + 4, answer.length);

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: answer.slice(0, cursor),
                }
              : message,
          ),
        );

        if (cursor >= answer.length) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsStreaming(false);
        }
      }, 48);
    }, 900);
  }

  function submitPrompt(prompt: string, answer = getRandomAssistantAnswer()) {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      textareaRef.current?.focus();
      return;
    }

    if (isStreaming) {
      return;
    }

    const userMessage: ChatMessage = {
      content: trimmedPrompt,
      id: nextId("user"),
      role: "user",
    };
    const assistantMessage: ChatMessage = {
      content: "",
      id: nextId("assistant"),
      isPlan: true,
      role: "assistant",
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput("");
    setError("");
    setIsStreaming(true);
    streamAssistantAnswer(assistantMessage.id, answer);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitPrompt(input);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter") {
      return;
    }

    if (event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    submitPrompt(input);
  }

  const showEmptyState = messages.length === 0;
  const isDarkTheme = isThemeReady ? resolvedTheme !== "light" : true;
  const canSendMessage = input.trim().length > 0 && !isStreaming;
  const hasConversationContent = messages.length > 0;
  const themeTooltip = isDarkTheme
    ? "Aydınlık Taraf'a Geç"
    : "Karanlık Taraf'a Geç";
  const composerPlaceholder = hasConversationContent
    ? "Herhangi bir şey sor…"
    : "5 kişilik aileyiz, evde şunlar var…";

  return (
    <MessageScrollerProvider
      autoScroll
      defaultScrollPosition="last-anchor"
      scrollPreviousItemPeek={72}
    >
      <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background text-foreground [touch-action:manipulation]">
        <header className="shrink-0 border-border/70 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
            <Link
              href="/"
              aria-label="Bereket AI ana sayfasına dön"
              className="-ml-2 flex min-h-11 min-w-0 items-center gap-3 rounded-2xl px-2 py-1.5 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <span
                className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-card"
                aria-hidden="true"
              >
                <RiRestaurant2Line />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-sm" translate="no">
                  Bereket AI
                </p>
                <p className="truncate text-muted-foreground text-xs">
                  Sprint 1
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={themeTooltip}
                      onClick={toggleTheme}
                    />
                  }
                >
                  {isDarkTheme ? (
                    <RiSunLine data-icon />
                  ) : (
                    <RiMoonLine data-icon />
                  )}
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={8}>
                  {themeTooltip}
                </TooltipContent>
              </Tooltip>
              {hasConversationContent && (
                <AlertDialog
                  open={isClearDialogOpen}
                  onOpenChange={setIsClearDialogOpen}
                >
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Sohbeti temizle"
                          onClick={() => setIsClearDialogOpen(true)}
                        />
                      }
                    >
                      <RiDeleteBin6Line data-icon />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={8}>
                      Sohbeti Temizle
                    </TooltipContent>
                  </Tooltip>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Sohbet temizlensin mi?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu işlem mevcut mesajları ve yazdığınız taslağı
                        temizler.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                      <AlertDialogAction
                        type="button"
                        variant="destructive"
                        onClick={confirmClearConversation}
                      >
                        Evet, temizle
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 sm:px-6">
            <MessageScroller className="min-h-0 flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent
                  aria-busy={isStreaming}
                  className={cn(
                    "gap-5 px-0 py-6 sm:py-8",
                    showEmptyState && "justify-center",
                  )}
                >
                  {showEmptyState ? (
                    <MessageScrollerItem messageId="empty-state">
                      <EmptyChatState
                        copy={emptyStateCopy}
                        onPrompt={submitPrompt}
                        scenarios={promptScenarios}
                        ready={isThemeReady}
                      />
                    </MessageScrollerItem>
                  ) : (
                    <>
                      <MessageScrollerItem messageId="mock-note">
                        <Marker variant="border">
                          <MarkerIcon>
                            <RiInformationLine />
                          </MarkerIcon>
                          <MarkerContent>
                            Prototip için hazırlanmıştır, gerçek veriye
                            dayanmamaktadır.
                          </MarkerContent>
                        </Marker>
                      </MessageScrollerItem>
                      {messages.map((message) => (
                        <MessageScrollerItem
                          key={message.id}
                          messageId={message.id}
                          scrollAnchor={message.role === "user"}
                        >
                          <ChatTurn
                            message={message}
                            isResponseStreaming={
                              isStreaming && message.role === "assistant"
                            }
                          />
                        </MessageScrollerItem>
                      ))}
                    </>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </main>

          <footer className="shrink-0 border-border/70 border-t bg-background/95 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 pt-3 sm:px-6">
              <form onSubmit={handleSubmit} className="w-full">
                <InputGroup className="min-h-28 rounded-3xl border border-border/90 bg-card/95 shadow-2xl shadow-black/10 backdrop-blur dark:bg-card/90">
                  <InputGroupTextarea
                    ref={textareaRef}
                    id="chat-prompt"
                    name="prompt"
                    placeholder={composerPlaceholder}
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    aria-invalid={Boolean(error)}
                    aria-describedby="chat-status"
                    className="min-h-20 resize-none px-3 py-3 text-base leading-6 sm:text-sm"
                    disabled={isStreaming}
                  />
                  <InputGroupAddon
                    align="block-end"
                    className="justify-end px-3 pt-0 pb-3"
                  >
                    <span
                      className={cn(
                        "inline-flex",
                        !canSendMessage && "cursor-not-allowed",
                      )}
                    >
                      <InputGroupButton
                        type="submit"
                        size="icon-sm"
                        variant="default"
                        aria-label="Mesajı gönder"
                        disabled={!canSendMessage}
                      >
                        {isStreaming ? (
                          <Spinner aria-label="Yanıt hazırlanıyor" data-icon />
                        ) : (
                          <RiArrowUpLine data-icon />
                        )}
                      </InputGroupButton>
                    </span>
                  </InputGroupAddon>
                </InputGroup>
              </form>
              <div
                id="chat-status"
                className="flex min-h-5 items-center justify-between gap-2 px-1 text-muted-foreground text-xs"
                aria-live="polite"
              >
                <span className={cn(error && "text-destructive")}>
                  {error || demoStatus}
                </span>
                <span className="hidden tabular-nums sm:inline">
                  {input.length}/800
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </MessageScrollerProvider>
  );
}

function EmptyChatState({
  copy,
  onPrompt,
  scenarios,
  ready,
}: {
  copy: EmptyStateCopy;
  onPrompt: (prompt: string, answer?: string) => void;
  scenarios: DemoPromptScenario[];
  ready: boolean;
}) {
  if (!ready) {
    return null;
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-2 py-10 text-center">
      <div className="flex w-full flex-col items-center gap-2">
        <h1 className="animate-enter-up text-balance font-semibold text-2xl sm:text-3xl">
          {copy.title}
        </h1>
        <p
          className="animate-enter-up max-w-xl text-muted-foreground text-sm leading-6"
          style={{ animationDelay: "80ms" }}
        >
          {copy.description}
        </p>
      </div>
      <div className="grid w-full gap-2 sm:grid-cols-3">
        {scenarios.map((scenario, index) => (
          <Button
            key={scenario.prompt}
            type="button"
            variant="outline"
            className="animate-enter-up h-auto min-h-14 justify-start whitespace-normal px-4 py-3 text-left leading-5"
            style={{ animationDelay: `${160 + index * 60}ms` }}
            onClick={() => onPrompt(scenario.prompt, scenario.answer)}
          >
            {scenario.prompt}
          </Button>
        ))}
      </div>
    </section>
  );
}

function ChatTurn({
  isResponseStreaming,
  message,
}: {
  isResponseStreaming: boolean;
  message: ChatMessage;
}) {
  const isUser = message.role === "user";
  const isWaitingForResponse =
    isResponseStreaming &&
    message.role === "assistant" &&
    message.content.length === 0;
  const showAssistantSummary =
    message.isPlan && !isResponseStreaming && message.content.length > 0;
  const footerText = isUser
    ? "Gönderildi"
    : isResponseStreaming
      ? ""
      : message.content.length > 0
        ? "Örnek veriyle oluşturulmuştur."
        : "Hazırlanıyor";

  return (
    <Message align={isUser ? "end" : "start"}>
      <MessageContent>
        <MessageHeader>{isUser ? "Siz" : "Bereket AI"}</MessageHeader>
        <Bubble
          align={isUser ? "end" : "start"}
          variant={isUser ? "default" : "ghost"}
          className={isUser ? undefined : "w-full"}
        >
          <BubbleContent
            className={cn(
              "text-left",
              isUser ? "max-w-xl" : "w-full max-w-none",
            )}
          >
            {isWaitingForResponse ? (
              <Marker role="status">
                <MarkerIcon>
                  <Spinner aria-label="Plan hazırlanıyor" />
                </MarkerIcon>
                <MarkerContent className="shimmer">
                  Plan oluşturuluyor…
                </MarkerContent>
              </Marker>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-6">
                {message.content}
              </div>
            )}
          </BubbleContent>
        </Bubble>
        {showAssistantSummary && <AssistantSummary />}
        {footerText && <MessageFooter>{footerText}</MessageFooter>}
      </MessageContent>
    </Message>
  );
}

function AssistantSummary() {
  return (
    <div className="flex flex-col gap-3">
      <AttachmentGroup
        role="group"
        aria-label="Plan özeti ekleri"
        tabIndex={0}
        className="py-0"
      >
        <Attachment state="done" size="sm">
          <AttachmentMedia variant="icon">
            <RiFileList3Line />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>5 günlük plan</AttachmentTitle>
            <AttachmentDescription>5 gün · 5 öneri</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment state="done" size="sm">
          <AttachmentMedia variant="icon">
            <RiShoppingBasket2Line />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Eksik alışveriş</AttachmentTitle>
            <AttachmentDescription>
              4 ürün · {currencyFormatter.format(fixedPlan.totalCost)}
            </AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment state="done" size="sm">
          <AttachmentMedia variant="icon">
            <RiWallet3Line />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Bütçe kontrolü</AttachmentTitle>
            <AttachmentDescription>900 TL içinde kalır</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </AttachmentGroup>
      <div className="rounded-xl border border-border bg-card/70 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-medium text-sm">Skor özeti</p>
          <Badge variant="outline" className="rounded-full tabular-nums">
            0-100
          </Badge>
        </div>
        <ChartContainer
          config={scoreChartConfig}
          className="h-36 w-full"
          initialDimension={{ height: 144, width: 360 }}
        >
          <BarChart
            accessibilityLayer
            data={scoreChartData}
            margin={{ bottom: 0, left: 0, right: 0, top: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="metric"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="score" radius={[6, 6, 2, 2]}>
              {scoreChartData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <div className="flex flex-wrap gap-2">
        {fixedPlan.scores.map((score) => (
          <Badge key={score.key} variant="secondary" className="rounded-full">
            {score.label}: {score.value}/100
          </Badge>
        ))}
        <Badge variant="outline" className="rounded-full">
          Kiler: {fixedPlan.usedIngredients.join(", ")}
        </Badge>
      </div>
      <Marker variant="border">
        <MarkerIcon>
          <RiFridgeLine />
        </MarkerIcon>
        <MarkerContent>
          Tavuk ve yoğurt ilk günlere alınarak bozulma riski azaltıldı.
        </MarkerContent>
      </Marker>
    </div>
  );
}
