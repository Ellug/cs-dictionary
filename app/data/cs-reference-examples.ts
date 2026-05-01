import { type MethodItem, type Section } from "./cs-data";

export type MethodExample = {
  title?: string;
  language?: "csharp" | "text";
  code: string;
  explanation: string;
};

export function getMethodExampleKey(sectionId: string, methodName: string): string {
  return `${sectionId}::${methodName}`;
}

const explicitMethodExamples: Record<string, MethodExample> = {
  [getMethodExampleKey("dictionary", ".TryGetValue(key, out val)")]: {
    title: "예외 없이 Dictionary 조회하기",
    language: "csharp",
    code: `var hpByPlayer = new Dictionary<int, int>
{
    [101] = 120,
    [102] = 80,
};

int targetId = 102;

if (hpByPlayer.TryGetValue(targetId, out var hp))
{
    // 키가 있으면 true, 값은 out 매개변수로 전달됨
    Console.WriteLine($"target hp = {hp}");
}
else
{
    // 키가 없으면 false. KeyNotFoundException이 발생하지 않음
    Console.WriteLine("target not found");
}`,
    explanation:
      "실전에서는 인덱서(dict[key])보다 TryGetValue가 안전하다. 키가 없을 수 있는 조회 경로(네트워크 패킷, 사용자 입력, 캐시 조회)에서 기본 선택으로 쓰면 된다.",
  },
  [getMethodExampleKey("iterator", "foreach (var x in col)")]: {
    title: "foreach 내부 동작 이해하기",
    language: "csharp",
    code: `foreach (var x in col)
{
    Console.WriteLine(x);
}

// 컴파일러가 개념적으로 아래 형태로 변환
using (var e = col.GetEnumerator())
{
    while (e.MoveNext())
    {
        var x = e.Current;
        Console.WriteLine(x);
    }
}`,
    explanation:
      "면접 단골 포인트: foreach는 GetEnumerator/MoveNext/Current 프로토콜을 사용한다. 열거자가 IDisposable이면 종료 시 Dispose까지 보장된다.",
  },
  [getMethodExampleKey("nullable", "x ?? y")]: {
    title: "null 병합 연산자",
    language: "csharp",
    code: `string? nicknameFromServer = null;
string displayName = nicknameFromServer ?? "Guest";

// nicknameFromServer가 null이면 "Guest"
Console.WriteLine(displayName);`,
    explanation:
      "UI 표시 문자열이나 옵션값 기본치 설정에서 매우 자주 쓰인다. null 체크 분기를 줄여 가독성을 높이는 데 효과적이다.",
  },
};

function pickPrimaryToken(methodName: string): string {
  const trimmed = methodName.trim();
  if (trimmed.includes(" / ")) {
    return trimmed.split(" / ")[0].trim();
  }
  return trimmed;
}

function sectionSetup(sectionId: Section["id"]): { receiver: string; setup: string } {
  switch (sectionId) {
    case "string-methods":
      return {
        receiver: "text",
        setup: `string text = "  Hello,World  ";
char separator = ',';
string[] arr = { "A", "B", "C" };`,
      };
    case "stringbuilder":
      return {
        receiver: "sb",
        setup: `var sb = new StringBuilder("Hello");
int index = 1;`,
      };
    case "array":
      return {
        receiver: "arr",
        setup: `int[] arr = { 3, 1, 4, 1, 5 };
int[] src = { 10, 20, 30 };
int[] dst = new int[5];
int[,] grid = new int[2, 3];`,
      };
    case "list":
      return {
        receiver: "list",
        setup: `var list = new List<int> { 3, 1, 4 };
var other = new List<int> { 9, 2, 6 };`,
      };
    case "dictionary":
      return {
        receiver: "dict",
        setup: `var dict = new Dictionary<string, int>
{
    ["apple"] = 3,
    ["banana"] = 5,
};`,
      };
    case "hashset":
      return {
        receiver: "set",
        setup: `var set = new HashSet<int> { 1, 2, 3 };
var other = new HashSet<int> { 3, 4, 5 };`,
      };
    case "stack":
      return {
        receiver: "stack",
        setup: `var stack = new Stack<int>();
stack.Push(10);
stack.Push(20);`,
      };
    case "queue":
      return {
        receiver: "queue",
        setup: `var queue = new Queue<int>();
queue.Enqueue(10);
queue.Enqueue(20);`,
      };
    case "math":
      return {
        receiver: "Math",
        setup: `double x = 3.5;
double y = -2.0;`,
      };
    case "linq":
      return {
        receiver: "nums",
        setup: `var nums = new[] { 1, 2, 3, 4, 5 };
var words = new[] { "apple", "bee", "cat", "dog" };`,
      };
    case "priority-queue":
      return {
        receiver: "pq",
        setup: `var pq = new PriorityQueue<string, int>();
pq.Enqueue("normal", 10);
pq.Enqueue("urgent", 1);`,
      };
    case "deque":
      return {
        receiver: "linked",
        setup: `var linked = new LinkedList<int>();
linked.AddLast(10);
linked.AddLast(20);`,
      };
    case "type-convert":
      return {
        receiver: "value",
        setup: `string str = "42";
double number = 3.14;
object value = str;`,
      };
    case "bitwise":
      return {
        receiver: "n",
        setup: `int a = 0b_1010;
int b = 0b_1100;
int n = 12;`,
      };
    case "nullable":
      return {
        receiver: "nullableValue",
        setup: `int? nullableValue = null;
string? nullableText = null;
int fallback = 100;`,
      };
    case "pattern-matching":
      return {
        receiver: "x",
        setup: `object x = 7;
string? text = "hello";`,
      };
    case "tuple":
      return {
        receiver: "t",
        setup: `var t = (id: 1, name: "Knight");
var simple = (1, "A");`,
      };
    case "int-types":
      return {
        receiver: "n",
        setup: `int n = 123;
long big = 9_000_000_000L;`,
      };
    case "float-types":
      return {
        receiver: "d",
        setup: `float f = 1.5f;
double d = 2.75;
decimal m = 9.99m;`,
      };
    case "other-types":
      return {
        receiver: "obj",
        setup: `bool flag = true;
char ch = 'A';
object obj = "hello";`,
      };
    case "collections-misc":
      return {
        receiver: "collection",
        setup: `var sortedMap = new SortedDictionary<int, string>();
var sortedSet = new SortedSet<int> { 3, 1, 2 };`,
      };
    case "exceptions":
      return {
        receiver: "ex",
        setup: `try
{
    throw new InvalidOperationException("sample");
}
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
}`,
      };
    case "record":
      return {
        receiver: "person",
        setup: `record Person(string Name, int Age);
var person = new Person("Kim", 30);`,
      };
    case "async-patterns":
      return {
        receiver: "task",
        setup: `var task = Task.Delay(100);
using var cts = new CancellationTokenSource();`,
      };
    case "iterator":
      return {
        receiver: "iterable",
        setup: `IEnumerable<int> iterable = Enumerable.Range(1, 5);`,
      };
    case "generics":
      return {
        receiver: "genericValue",
        setup: `T Echo<T>(T val) => val;
int genericValue = Echo(10);`,
      };
    case "delegate-event":
      return {
        receiver: "fn",
        setup: `Func<int, int> fn = x => x * 2;
Action<string> log = msg => Console.WriteLine(msg);`,
      };
    case "properties":
      return {
        receiver: "player",
        setup: `var player = new Player();
player.Hp = 100;`,
      };
    case "ref-out-in":
      return {
        receiver: "value",
        setup: `int value = 10;
bool ok = int.TryParse("42", out var parsed);`,
      };
    case "span-memory":
      return {
        receiver: "span",
        setup: `int[] arr = { 1, 2, 3, 4 };
Span<int> span = arr.AsSpan();
string text = "12345";`,
      };
    case "access-modifiers":
      return {
        receiver: "member",
        setup: `class Player
{
    public int Hp;
    private int _mp;
}`,
      };
    default:
      return { receiver: "value", setup: "var value = 10;" };
  }
}

function makeStatement(line: string): string {
  const trimmed = line.trim();
  if (!trimmed) return trimmed;
  if (trimmed.endsWith(";") || trimmed.endsWith("}") || trimmed.endsWith("{")) return trimmed;
  return `${trimmed};`;
}

function buildGenericUsage(sectionId: Section["id"], methodName: string): string {
  const { receiver } = sectionSetup(sectionId);
  const primary = pickPrimaryToken(methodName);

  if (primary.startsWith("foreach")) {
    return `foreach (var item in iterable)
{
    Console.WriteLine(item);
}`;
  }

  if (primary.startsWith("await foreach")) {
    return `await foreach (var item in stream)
{
    Console.WriteLine(item);
}`;
  }

  if (primary.startsWith("switch")) {
    return `switch (receiverValue)
{
    case > 0:
        Console.WriteLine("positive");
        break;
    default:
        Console.WriteLine("etc");
        break;
}`;
  }

  if (primary.startsWith("x switch")) {
    return `var result = receiverValue switch
{
    > 0 => "positive",
    _ => "other",
};`;
  }

  if (primary.startsWith("new ")) {
    return `var value = ${primary};`;
  }

  if (primary.startsWith(".") || primary.startsWith("[")) {
    return `var result = ${receiver}${primary};`;
  }

  if (
    primary.startsWith("Math.") ||
    primary.startsWith("Array.") ||
    primary.startsWith("Enumerable.") ||
    primary.startsWith("BitOperations.") ||
    primary.startsWith("Random.") ||
    primary.startsWith("Convert.") ||
    primary.startsWith("string.")
  ) {
    return `var result = ${primary};`;
  }

  if (
    primary.startsWith("try ") ||
    primary.startsWith("catch ") ||
    primary.startsWith("finally ") ||
    primary.startsWith("throw")
  ) {
    return `// 예외 처리 구문은 블록 단위로 사용
${primary}`;
  }

  if (
    primary.startsWith("public") ||
    primary.startsWith("private") ||
    primary.startsWith("protected") ||
    primary.startsWith("internal") ||
    primary.startsWith("file")
  ) {
    return `// 접근 제어자 예시
${primary} int hp;`;
  }

  if (
    primary === "byte" ||
    primary === "sbyte" ||
    primary === "short" ||
    primary === "ushort" ||
    primary === "int" ||
    primary === "uint" ||
    primary === "long" ||
    primary === "ulong" ||
    primary === "nint / nuint"
  ) {
    const typeName = primary.includes("/") ? "nint" : primary;
    return `${typeName} number = 123;`;
  }

  if (primary === "float" || primary === "double" || primary === "decimal") {
    if (primary === "float") return `float number = 1.23f;`;
    if (primary === "double") return `double number = 1.23;`;
    return `decimal number = 1.23m;`;
  }

  if (primary === "bool" || primary === "char" || primary === "string") {
    if (primary === "bool") return "bool flag = true;";
    if (primary === "char") return "char grade = 'A';";
    return 'string message = "hello";';
  }

  if (primary.startsWith("$\"")) {
    return `string name = "Player";
var message = ${primary};`;
  }

  if (primary.startsWith("@\"") || primary.startsWith("\"\"\"")) {
    return `var text = ${primary};`;
  }

  if (primary.includes(" = ")) {
    return makeStatement(primary);
  }

  if (primary.includes("(") && primary.includes(")")) {
    return `// 호출 형태 예시
${makeStatement(primary)}`;
  }

  return `// 사용 형태 예시
// ${primary}`;
}

function buildDefaultExample(
  section: Section,
  method: MethodItem
): MethodExample {
  const setupInfo = sectionSetup(section.id);
  const usage = buildGenericUsage(section.id, method.name);
  const code = `${setupInfo.setup}

// ${method.name}
${usage}`;

  return {
    title: `${section.title} - ${method.name}`,
    language: "csharp",
    code,
    explanation: `${method.desc}${method.example ? ` (참고: ${method.example})` : ""}`,
  };
}

export function getMethodExample(section: Section, method: MethodItem): MethodExample {
  const key = getMethodExampleKey(section.id, method.name);
  const explicit = explicitMethodExamples[key];
  if (explicit) return explicit;
  return buildDefaultExample(section, method);
}
