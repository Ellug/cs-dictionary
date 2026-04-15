export type PatternItem = {
  term: string;
  oneliner: string;
  category: "생성" | "구조" | "행동" | "아키텍처";
  detail: string[];
  csharp?: string;
};

export type PatternSection = {
  id: string;
  title: string;
  color: "yellow" | "red" | "white";
  items: PatternItem[];
};

export const patternSections: PatternSection[] = [
  // ── 생성 패턴 ─────────────────────────────────────────────
  {
    id: "creational",
    title: "생성 패턴 (Creational)",
    color: "yellow",
    items: [
      {
        term: "싱글턴 (Singleton)",
        oneliner: "인스턴스를 전역에 딱 하나만 유지",
        category: "생성",
        detail: [
          "SOLID: SRP 위반 위험 (전역 상태). 과용 금지. DI 컨테이너 Singleton 라이프타임 권장",
          "private 생성자 + static readonly Instance 프로퍼티",
          "Lazy<T>: 최초 접근 시 생성, 스레드 안전 (LazyThreadSafetyMode.ExecutionAndPublication 기본)",
          "static 필드 초기화: CLR이 타입 초기화 시 스레드 안전 보장",
          "double-checked locking: lock(sync) + null 체크 두 번 → Lazy<T>로 대체 가능",
          "단점: 전역 상태 → 테스트 격리 어려움. 단위 테스트 시 매번 초기화 필요",
          "단점: 강결합 유발. 과용 시 '전역 변수의 OOP 버전'이 됨",
          "대안: DI 컨테이너에 Singleton 라이프타임으로 등록 (테스트 대체 가능)",
          "사용처: 로거, 설정, 캐시, 커넥션 풀, 이벤트 버스",
        ],
        csharp:
          "private static readonly Lazy<MyClass> _instance =\n    new(() => new MyClass(), LazyThreadSafetyMode.ExecutionAndPublication);\npublic static MyClass Instance => _instance.Value;\nprivate MyClass() { } // 외부 생성 차단",
      },
      {
        term: "팩토리 메서드 (Factory Method)",
        oneliner: "객체 생성을 서브클래스에게 위임. 어떤 타입 만들지는 자식이 결정",
        category: "생성",
        detail: [
          "SOLID: OCP(새 제품 추가 시 기존 코드 수정 없음) + DIP(클라이언트가 추상 Creator만 의존)",
          "Creator 추상 클래스에 abstract Product CreateProduct() 선언",
          "ConcreteCreator가 CreateProduct()를 오버라이드해 구체 타입 반환",
          "클라이언트는 Creator만 알고 구체 타입 몰라도 됨 → OCP 달성",
          "Simple Factory와 차이: Simple Factory는 패턴이 아닌 관용구. 서브클래싱 없음",
          "추상 팩토리와 차이: 팩토리 메서드는 한 종류의 제품만, 추상 팩토리는 관련 제품군 전체",
          "사용처: 프레임워크, UI 컨트롤 생성, 문서 편집기, ORM 쿼리 생성",
        ],
        csharp:
          "abstract class Dialog {\n    public void Render() { var btn = CreateButton(); btn.Render(); }\n    public abstract IButton CreateButton(); // 팩토리 메서드\n}\nclass WindowsDialog : Dialog {\n    public override IButton CreateButton() => new WindowsButton();\n}",
      },
      {
        term: "추상 팩토리 (Abstract Factory)",
        oneliner: "연관된 객체 군(패밀리)을 묶어서 생성. 구체 클래스 지정 안 함",
        category: "생성",
        detail: [
          "SOLID: OCP(새 플랫폼 추가 = 새 Factory만 추가) + DIP(클라이언트가 인터페이스에만 의존)",
          "인터페이스에 CreateButton(), CreateCheckbox() 등 여러 팩토리 메서드 묶음",
          "WindowsFactory, MacFactory 등 구체 팩토리가 각 플랫폼 객체 생성",
          "팩토리 메서드와 차이: 관련 객체 군 전체를 일관되게 교체 가능",
          "새 플랫폼 추가 = 새 ConcreteFactory만 추가 → OCP 달성",
          "단점: 새 제품 종류 추가 시 모든 팩토리 인터페이스/구현 수정 필요",
          "사용처: 크로스플랫폼 UI, 테마/스킨 시스템, DB 드라이버 패밀리",
        ],
        csharp:
          "interface IGUIFactory {\n    IButton CreateButton();\n    ICheckbox CreateCheckbox();\n}\nclass MacFactory : IGUIFactory {\n    public IButton CreateButton() => new MacButton();\n    public ICheckbox CreateCheckbox() => new MacCheckbox();\n}",
      },
      {
        term: "빌더 (Builder)",
        oneliner: "복잡한 객체를 단계별로 조립. 같은 과정으로 다른 표현 생성 가능",
        category: "생성",
        detail: [
          "SOLID: SRP(객체 조립 책임 분리) + OCP(새 빌더 추가로 새 표현 지원)",
          "Director가 Builder 인터페이스를 통해 조립 순서 제어",
          "ConcreteBuilder가 실제 부품 조립 후 GetResult()로 반환",
          "C#에서는 메서드 체이닝(Fluent Builder)이 흔함: builder.SetA().SetB().Build()",
          "생성자 파라미터가 4개 이상이면 빌더 고려. 선택적 파라미터가 많을 때 특히 유용",
          "불변 객체(record) 생성에도 활용: with 표현식이 짧은 대안",
          "Director 없이 클라이언트가 직접 빌더 조립하는 방식도 흔함",
          "사용처: SQL/HTTP 쿼리 빌더, 복잡한 설정 객체, 테스트 데이터 생성(Test Data Builder)",
        ],
        csharp:
          "var query = new QueryBuilder()\n    .From(\"users\")\n    .Where(\"age > 18\")\n    .OrderBy(\"name\", descending: true)\n    .Limit(50)\n    .Build();\n// Build()가 불변 Query 객체 반환",
      },
      {
        term: "프로토타입 (Prototype)",
        oneliner: "기존 객체를 복사해서 새 객체 생성. 생성 비용이 클 때 유용",
        category: "생성",
        detail: [
          "SOLID: OCP(기존 클래스 수정 없이 복사 기반 생성 추가) — 직접적 SOLID 연관보단 성능 패턴",
          "ICloneable 인터페이스 또는 직접 Clone() 메서드 구현",
          "얕은 복사(MemberwiseClone): 값 타입/string은 복사, 참조 타입은 주소 공유",
          "깊은 복사: 참조 타입 필드도 재귀적으로 Clone() 호출 또는 직렬화 활용",
          "직렬화 방법: JsonSerializer.Deserialize(JsonSerializer.Serialize(obj))",
          "C# record: with 표현식이 얕은 복사 프로토타입의 현대적 대안",
          "복잡한 초기화(DB 조회 등) 없이 이미 설정된 객체 복제할 때 효과적",
          "사용처: 게임 오브젝트 스폰, 설정 템플릿, 언두/리두 스냅샷, 캐시된 원형 복제",
        ],
        csharp:
          "class Monster : ICloneable {\n    public string Name { get; set; }\n    public List<Skill> Skills { get; set; }\n    // 깊은 복사: Skills 목록도 복제\n    public object Clone() {\n        var m = (Monster)MemberwiseClone();\n        m.Skills = Skills.Select(s => (Skill)s.Clone()).ToList();\n        return m;\n    }\n}\nvar boss = (Monster)template.Clone();",
      },
    ],
  },
  // ── 구조 패턴 ─────────────────────────────────────────────
  {
    id: "structural",
    title: "구조 패턴 (Structural)",
    color: "white",
    items: [
      {
        term: "어댑터 (Adapter)",
        oneliner: "호환되지 않는 인터페이스를 연결. 기존 코드 변경 없이 통합",
        category: "구조",
        detail: [
          "SOLID: OCP(기존 코드 변경 없이 통합) + SRP(변환 책임만 가짐)",
          "Target 인터페이스를 구현하고 내부에서 Adaptee를 감쌈(컴포지션)",
          "클래스 어댑터: Adaptee를 상속. 다중 상속 가능한 언어에서만 유효",
          "객체 어댑터(컴포지션): C# 권장. Adaptee를 필드로 보유",
          "양방향 어댑터: 양쪽 인터페이스 모두 구현해 어느 쪽으로도 사용 가능",
          "데코레이터와 차이: 어댑터는 인터페이스 변환, 데코레이터는 같은 인터페이스로 기능 추가",
          "프록시와 차이: 프록시는 같은 인터페이스 유지, 어댑터는 인터페이스 변환",
          "사용처: 서드파티 라이브러리 통합, 레거시 API 래핑, 플러그인 시스템",
        ],
        csharp:
          "// XmlParser(기존)를 IJsonProvider(새 인터페이스)에 맞춤\nclass XmlToJsonAdapter : IJsonProvider {\n    private readonly XmlParser _xml;\n    public XmlToJsonAdapter(XmlParser xml) => _xml = xml;\n    public string GetJson() => ConvertXmlToJson(_xml.GetXml());\n}",
      },
      {
        term: "브리지 (Bridge)",
        oneliner: "추상화와 구현을 분리해 독립적으로 변경 가능하게",
        category: "구조",
        detail: [
          "SOLID: OCP(추상/구현 각각 독립 확장) + DIP(추상화가 구현 인터페이스에 의존)",
          "추상 클래스가 구현 인터페이스를 has-a(컴포지션)로 보유",
          "Shape(추상) × Renderer(구현)을 각각 독립적으로 확장 가능",
          "상속 계층 폭발 문제 해결: Shape 3개 × Color 4개 = 12 클래스 → Bridge 사용 시 7개",
          "추상화 계층과 구현 계층이 모두 확장될 예정일 때 사용",
          "어댑터와 차이: 어댑터는 기존 코드 통합, 브리지는 설계 단계부터 분리 목적",
          "사용처: 크로스플랫폼 렌더러, 디바이스 드라이버, 로깅 백엔드 교체",
        ],
        csharp:
          "interface IRenderer { void RenderCircle(float radius); }\nabstract class Shape {\n    protected readonly IRenderer _renderer;\n    protected Shape(IRenderer r) => _renderer = r;\n    public abstract void Draw();\n}\nclass Circle : Shape {\n    float _radius;\n    public Circle(IRenderer r, float radius) : base(r) => _radius = radius;\n    public override void Draw() => _renderer.RenderCircle(_radius);\n}",
      },
      {
        term: "컴포지트 (Composite)",
        oneliner: "개별 객체와 복합 객체를 동일하게 다룸. 트리 구조 표현",
        category: "구조",
        detail: [
          "SOLID: LSP(Leaf와 Composite 모두 Component로 대체 가능) + OCP(새 컴포넌트 추가 용이)",
          "Component 인터페이스를 Leaf와 Composite 모두 구현",
          "Composite는 List<IComponent> 보유하고 Execute() 시 재귀 호출",
          "클라이언트는 단일/복합 구분 없이 같은 인터페이스로 처리",
          "Add/Remove/GetChildren은 Composite에만 있음 → Component에 두면 Leaf에서 문제",
          "투명성(Transparency) vs 안전성(Safety) 트레이드오프 설계 결정",
          "사용처: 파일 시스템(파일/폴더), UI 컴포넌트 트리, 조직도, 메뉴, 수식 트리",
        ],
        csharp:
          "interface IComponent { void Execute(); int GetPrice(); }\nclass Leaf : IComponent {\n    public void Execute() => Console.WriteLine(Name);\n    public int GetPrice() => _price;\n}\nclass Composite : IComponent {\n    List<IComponent> _children = new();\n    public void Execute() => _children.ForEach(c => c.Execute());\n    public int GetPrice() => _children.Sum(c => c.GetPrice());\n}",
      },
      {
        term: "데코레이터 (Decorator)",
        oneliner: "기존 객체를 감싸서 동적으로 기능 추가. 상속 없이 확장",
        category: "구조",
        detail: [
          "SOLID: OCP(기존 클래스 수정 없이 기능 추가) + SRP(각 데코레이터가 한 기능만 담당)",
          "Component 인터페이스를 구현하면서 동일 인터페이스 참조 보유",
          "체이닝 가능: new LogDecorator(new CacheDecorator(new Service()))",
          "상속 대신 컴포지션 → 런타임에 조합 변경 가능",
          "C# Stream 계층이 대표 사례: GZipStream(CryptoStream(FileStream(...)))",
          "어댑터와 차이: 데코레이터는 인터페이스 유지하며 기능 추가, 어댑터는 인터페이스 변환",
          "단점: 데코레이터를 많이 쌓으면 디버깅 어려움. 특정 데코레이터만 제거 불편",
          "사용처: 로깅/캐싱/인증/압축 미들웨어, I/O 스트림, HTTP 핸들러 파이프라인",
        ],
        csharp:
          "class LoggingDecorator : IService {\n    private readonly IService _inner;\n    public LoggingDecorator(IService inner) => _inner = inner;\n    public string Execute(string input) {\n        Console.WriteLine($\"Before: {input}\");\n        var result = _inner.Execute(input);\n        Console.WriteLine($\"After: {result}\");\n        return result;\n    }\n}",
      },
      {
        term: "퍼사드 (Facade)",
        oneliner: "복잡한 서브시스템에 단순한 단일 진입점 제공",
        category: "구조",
        detail: [
          "SOLID: SRP(진입점 단일화) + ISP(클라이언트가 필요 없는 서브시스템 직접 알 필요 없음)",
          "내부 복잡도 숨기고 클라이언트에게 간단한 API만 노출",
          "서브시스템 클래스들은 건드리지 않고 퍼사드만 추가 → OCP 유지",
          "레이어드 아키텍처에서 레이어 간 진입점 역할 (서비스 레이어 = 퍼사드)",
          "여러 퍼사드로 나누어 각 사용 시나리오별로 제공 가능",
          "미들웨어와 차이: 퍼사드는 단순화, 미들웨어는 파이프라인 처리",
          "단점: 퍼사드가 비대해지면 God Object 위험. 서브시스템 직접 접근 차단 안 됨",
          "사용처: SDK API, 서비스 레이어, 홈 시어터 리모컨, 복잡한 라이브러리 래핑",
        ],
        csharp:
          "class OrderFacade {\n    private readonly InventoryService _inventory;\n    private readonly PaymentService _payment;\n    private readonly ShippingService _shipping;\n    // 복잡한 주문 처리를 한 메서드로\n    public async Task<OrderResult> PlaceOrder(Cart cart) {\n        await _inventory.Reserve(cart);\n        var receipt = await _payment.Charge(cart.Total);\n        var tracking = await _shipping.Dispatch(cart, receipt);\n        return new OrderResult(receipt, tracking);\n    }\n}",
      },
      {
        term: "플라이웨이트 (Flyweight)",
        oneliner: "공유 가능한 상태를 분리해 대량 객체의 메모리 절약",
        category: "구조",
        detail: [
          "SOLID: SRP(내재 상태만 담당) — 직접적 SOLID보다 성능/메모리 최적화 패턴",
          "내재 상태(Intrinsic, 공유·불변): 객체가 공유. 예) 문자 모양, 텍스처",
          "외재 상태(Extrinsic, 컨텍스트): 호출자가 전달. 예) 문자 위치, 색상",
          "팩토리에서 Dictionary로 캐시해두고 같은 내재 상태면 재사용",
          "C# string interning이 플라이웨이트의 언어 수준 구현",
          "수백만 개 객체가 필요할 때 효과적. 객체 수 × (메모리 절약량)이 커야 의미 있음",
          "단점: 코드 복잡도 증가. 내재/외재 상태 분리 설계 어려움",
          "사용처: 텍스트 에디터의 문자 객체, 게임 파티클/총알, 지도 타일, 폰트 글리프",
        ],
        csharp:
          "class TreeType { // 내재 상태(공유)\n    public string Name { get; }\n    public Texture Texture { get; }\n    public void Draw(int x, int y) { /* x,y는 외재 상태 */ }\n}\nclass TreeFactory {\n    static Dictionary<string, TreeType> _cache = new();\n    public static TreeType Get(string name, Texture tex) =>\n        _cache.TryGetValue(name, out var t) ? t : _cache[name] = new TreeType(name, tex);\n}",
      },
      {
        term: "프록시 (Proxy)",
        oneliner: "실제 객체 대신 대리자를 두어 접근 제어, 지연 로딩, 로깅 등 처리",
        category: "구조",
        detail: [
          "SOLID: OCP(실제 객체 수정 없이 부가 기능 추가) + DIP(클라이언트는 인터페이스에만 의존)",
          "Virtual Proxy: 실제 객체 생성을 필요한 순간까지 지연 (lazy loading)",
          "Protection Proxy: 접근 권한 체크. 클라이언트 역할에 따라 다른 동작",
          "Remote Proxy: 원격 객체를 로컬인 것처럼 사용 (gRPC, WCF 클라이언트 스텁)",
          "Caching Proxy: 결과를 메모리에 캐시해 중복 호출 방지",
          "Logging Proxy: 메서드 호출 전후 로깅. AOP의 수동 구현",
          "데코레이터와 차이: 데코레이터는 기능 추가, 프록시는 접근 제어/대리. 코드 구조는 유사",
          "사용처: EF Core lazy loading, 인증 미들웨어, CDN, 모의 객체(Mock)",
        ],
        csharp:
          "class ImageProxy : IImage {\n    private Image? _real;\n    private readonly string _path;\n    public ImageProxy(string path) => _path = path;\n    public void Display() {\n        _real ??= new HighResImage(_path); // 최초 접근 시만 로드\n        _real.Display();\n    }\n}",
      },
    ],
  },
  // ── 행동 패턴 ─────────────────────────────────────────────
  {
    id: "behavioral",
    title: "행동 패턴 (Behavioral)",
    color: "red",
    items: [
      {
        term: "전략 (Strategy)",
        oneliner: "알고리즘군을 캡슐화해 런타임에 교체 가능하게",
        category: "행동",
        detail: [
          "SOLID: OCP(새 전략 추가 시 Context 수정 없음) + DIP(Context가 인터페이스에만 의존)",
          "Context 클래스가 IStrategy 인터페이스 참조 보유. 행동 위임",
          "ConcreteStrategy를 교체하면 Context 코드 변경 없이 동작이 바뀜",
          "if-else / switch 타입 분기를 제거하는 데 효과적",
          "C#에서는 Func<T, TResult> 델리게이트로 경량 전략 구현 가능",
          "템플릿 메서드와 차이: 전략은 컴포지션(교체), 템플릿 메서드는 상속(오버라이드)",
          "사용처: 정렬 알고리즘, 결제 방식, 압축 방식, 내비게이션 경로, 할인 정책",
        ],
        csharp:
          "interface ISortStrategy { void Sort(int[] arr); }\nclass Sorter {\n    public ISortStrategy Strategy { get; set; } = new QuickSort();\n    public void Sort(int[] arr) => Strategy.Sort(arr);\n}\n// 런타임 교체\nsorter.Strategy = new MergeSort();\n// 또는 Func으로 경량 구현\nSorter sorter2 = new(strategy: arr => Array.Sort(arr));",
      },
      {
        term: "옵저버 (Observer)",
        oneliner: "상태 변경을 구독자에게 자동 통보. 발행자는 구독자를 몰라도 됨",
        category: "행동",
        detail: [
          "SOLID: OCP(새 Observer 추가 시 Subject 수정 없음) + DIP(Subject가 IObserver 인터페이스에만 의존)",
          "Subject가 List<IObserver> 보유. 상태 변경 시 Notify() → 모든 Observer 호출",
          "C#의 event/delegate가 옵저버 패턴 내장 구현 (언어 수준 지원)",
          "IObservable<T>/IObserver<T>: .NET 표준 인터페이스 (Reactive Extensions 기반)",
          "Push 모델(데이터 전달) vs Pull 모델(Observer가 상태 직접 읽음)",
          "구독 해제 누락 시 메모리 누수 위험. event -= handler 또는 IDisposable 구독 반환",
          "단점: 알림 순서 보장 안 됨. 무한 루프 가능 (Observer가 Subject 수정 시)",
          "사용처: UI 이벤트, 게임 이벤트 시스템, MVC Model→View 알림, 주식 시세",
        ],
        csharp:
          "class Stock {\n    public event EventHandler<decimal>? PriceChanged;\n    private decimal _price;\n    public decimal Price {\n        get => _price;\n        set { _price = value; PriceChanged?.Invoke(this, value); }\n    }\n}\n// 구독\nstock.PriceChanged += (_, price) => Console.WriteLine($\"가격: {price}\");\n// 구독 해제 필수!\nstock.PriceChanged -= handler;",
      },
      {
        term: "커맨드 (Command)",
        oneliner: "요청을 객체로 캡슐화. 실행 취소/재실행, 큐잉, 로깅 가능",
        category: "행동",
        detail: [
          "SOLID: SRP(Invoker·Command·Receiver 역할 분리) + OCP(새 커맨드 추가 시 Invoker 수정 없음)",
          "ICommand { void Execute(); void Undo(); } 인터페이스",
          "Invoker가 Command 객체를 Stack에 저장. Undo 시 Pop하여 Undo() 호출",
          "Receiver는 실제 작업 수행. Command는 Invoker-Receiver 연결만 담당",
          "매크로: 여러 커맨드를 리스트로 묶어 순서대로 실행 (Composite Command)",
          "큐잉: 커맨드를 Queue에 넣어 나중에 실행. 트랜잭션 로그 역할",
          "사용처: 에디터 Ctrl+Z, 트랜잭션 로그, 작업 큐, 매크로 녹화, 게임 리플레이",
        ],
        csharp:
          "interface ICommand { void Execute(); void Undo(); }\nclass MoveCommand : ICommand {\n    readonly GameObject _obj; readonly Vector3 _delta;\n    public void Execute() => _obj.Position += _delta;\n    public void Undo()   => _obj.Position -= _delta;\n}\n// Invoker\nclass Editor {\n    Stack<ICommand> _history = new();\n    public void Do(ICommand cmd) { cmd.Execute(); _history.Push(cmd); }\n    public void Undo() { if (_history.TryPop(out var cmd)) cmd.Undo(); }\n}",
      },
      {
        term: "책임 연쇄 (Chain of Responsibility)",
        oneliner: "요청을 처리할 수 있는 핸들러를 체인으로 연결. 처리 못 하면 다음으로",
        category: "행동",
        detail: [
          "SOLID: SRP(각 핸들러가 하나의 처리 책임) + OCP(새 핸들러를 체인에 삽입해 확장)",
          "Handler가 다음 Handler 참조 보유. Handle() → 처리하거나 _next?.Handle(req) 전달",
          "요청자와 처리자 분리. 처리 순서 런타임에 유연하게 변경 가능",
          "처리가 완료되면 체인 중단 가능. 모든 핸들러를 통과하는 파이프라인과 차이",
          "ASP.NET Core 미들웨어 파이프라인이 대표 구현 (next() 호출 방식)",
          "단점: 요청이 처리되지 않고 끝날 수 있음. 디버깅 어려움",
          "사용처: 미들웨어, 이벤트 버블링, 승인 워크플로, 로그 레벨 필터, 예외 핸들러 체인",
        ],
        csharp:
          "abstract class Handler {\n    protected Handler? _next;\n    public Handler SetNext(Handler next) { _next = next; return next; }\n    public abstract bool Handle(Request req);\n}\nclass AuthHandler : Handler {\n    public override bool Handle(Request req) {\n        if (!req.IsAuthenticated) { Reject(req); return false; }\n        return _next?.Handle(req) ?? true;\n    }\n}",
      },
      {
        term: "반복자 (Iterator)",
        oneliner: "컬렉션 내부 구조 노출 없이 순차 접근",
        category: "행동",
        detail: [
          "SOLID: SRP(순회 책임을 컬렉션에서 분리) + ISP(클라이언트는 순회 인터페이스만 알면 됨)",
          "IEnumerator<T> { T Current; bool MoveNext(); void Reset(); } 인터페이스",
          "IEnumerable<T>를 구현하면 foreach 문에서 사용 가능",
          "C#의 yield return이 반복자 패턴 구현 자동화 (컴파일러가 상태 머신 생성)",
          "내부 반복자(컬렉션이 제어) vs 외부 반복자(클라이언트가 MoveNext 호출 제어)",
          "LINQ는 IEnumerable<T>를 기반으로 지연 평가(lazy evaluation) 체인 구성",
          "컬렉션 구현(배열/트리/그래프)이 바뀌어도 순회 코드 변경 없음",
          "사용처: 컬렉션 순회, 트리/그래프 DFS·BFS, 스트림 처리, 무한 수열",
        ],
        csharp:
          "// yield return으로 자동 반복자\nIEnumerable<int> Fibonacci() {\n    int a = 0, b = 1;\n    while (true) { yield return a; (a, b) = (b, a + b); }\n}\nforeach (var n in Fibonacci().Take(10))\n    Console.WriteLine(n);",
      },
      {
        term: "중재자 (Mediator)",
        oneliner: "객체들이 서로 직접 참조하지 않고 중재자를 통해 소통",
        category: "행동",
        detail: [
          "SOLID: SRP(각 컴포넌트는 고유 역할만. 통신 책임은 중재자) + DIP(컴포넌트가 IMediator에만 의존)",
          "객체 간 복잡한 의존관계(N:N) → 중재자로 집중(N:1:N)해서 단순화",
          "각 컴포넌트는 IMediator만 알면 됨. 서로를 몰라도 됨",
          "옵저버와 차이: 옵저버는 1:N 단방향, 중재자는 N:N 양방향 조율",
          "MediatR 라이브러리: .NET에서 CQRS 패턴 구현에 많이 씀 (IRequest, INotification)",
          "단점: 중재자 자체가 God Object가 될 위험. 로직이 분산되지 않고 집중됨",
          "사용처: 채팅룸, 항공 관제, UI 폼 컴포넌트 상호작용, CQRS 커맨드 버스",
        ],
        csharp:
          "interface IMediator { Task Send<T>(T request); }\n// MediatR 예시\npublic class CreateUserHandler : IRequestHandler<CreateUserCommand, Guid> {\n    public async Task<Guid> Handle(CreateUserCommand req, CancellationToken ct) {\n        var user = new User(req.Name, req.Email);\n        await _repo.AddAsync(user);\n        return user.Id;\n    }\n}\n// 사용: await _mediator.Send(new CreateUserCommand(\"Alice\", \"a@b.com\"));",
      },
      {
        term: "메멘토 (Memento)",
        oneliner: "객체 상태를 외부에 캡슐화해서 저장/복원. Undo/Redo 핵심",
        category: "행동",
        detail: [
          "SOLID: SRP(상태 저장·관리를 Caretaker로 분리, Originator는 상태만 담당)",
          "Originator: 상태 소유. CreateMemento()로 스냅샷 생성, Restore(m)으로 복원",
          "Memento: 상태 스냅샷. 불변 객체. 외부에서 내용 직접 접근 불가",
          "Caretaker: Memento 보관·관리. 스택에 쌓아서 Undo, 앞으로가면 Redo",
          "C# record가 불변 스냅샷으로 적합. with 표현식으로 변형 복사",
          "직렬화를 활용하면 파일/DB에 상태 영구 저장 가능",
          "단점: 상태 크기가 크면 메모리 사용량 증가. 자주 스냅샷하면 성능 저하",
          "사용처: 텍스트 에디터 Undo, 게임 세이브/로드, 트랜잭션 롤백, 버전 히스토리",
        ],
        csharp:
          "record EditorMemento(string Content, int CursorPos); // 불변 스냅샷\nclass Editor {\n    public string Content { get; set; } = \"\";\n    public int CursorPos { get; set; }\n    public EditorMemento Save() => new(Content, CursorPos);\n    public void Restore(EditorMemento m) => (Content, CursorPos) = (m.Content, m.CursorPos);\n}\nclass History { // Caretaker\n    Stack<EditorMemento> _undo = new();\n    public void Push(EditorMemento m) => _undo.Push(m);\n    public EditorMemento? Pop() => _undo.TryPop(out var m) ? m : null;\n}",
      },
      {
        term: "상태 (State)",
        oneliner: "내부 상태에 따라 객체 동작이 바뀜. 상태별로 클래스 분리",
        category: "행동",
        detail: [
          "SOLID: SRP(각 State 클래스가 하나의 상태 행동만 담당) + OCP(새 상태 추가 시 기존 State 수정 없음)",
          "Context가 현재 IState 참조 보유. 메서드 호출을 State에 위임",
          "ConcreteState가 동작 구현 + 전환 조건에 따라 ctx.State = new NextState() 설정",
          "if-else/switch로 상태 분기하는 코드를 각 State 클래스로 분산시킴",
          "전략 패턴과 차이: 상태는 State끼리 서로 알고 전환. 전략은 독립적인 알고리즘",
          "유한 상태 기계(FSM)를 OOP로 표현하는 방법",
          "단점: 상태가 많으면 클래스 수 폭발. 단순 상태라면 enum+switch가 더 적합",
          "사용처: 자판기, 신호등, 게임 캐릭터 상태, TCP 연결, 주문/결제 워크플로",
        ],
        csharp:
          "interface IState { void InsertCoin(VendingMachine ctx); void PressButton(VendingMachine ctx); }\nclass IdleState : IState {\n    public void InsertCoin(VendingMachine ctx) {\n        ctx.AddMoney(); ctx.State = new HasCoinState();\n    }\n    public void PressButton(VendingMachine ctx) => Console.WriteLine(\"동전을 먼저 넣어주세요\");\n}\nclass VendingMachine {\n    public IState State { get; set; } = new IdleState();\n    public void InsertCoin() => State.InsertCoin(this);\n}",
      },
      {
        term: "템플릿 메서드 (Template Method)",
        oneliner: "알고리즘 골격을 부모에 정의하고 세부 단계를 자식이 채움",
        category: "행동",
        detail: [
          "SOLID: OCP(알고리즘 골격 수정 없이 세부 단계만 오버라이드) + DIP(공통 흐름이 추상화에 의존)",
          "abstract class에 public sealed 메서드가 흐름 제어. abstract 메서드가 세부 단계",
          "자식은 전체 흐름 바꾸지 않고 특정 단계(abstract method)만 오버라이드",
          "훅(Hook): virtual로 선언된 빈 메서드. 자식이 선택적으로 오버라이드",
          "헐리우드 원칙: 우리가 당신을 부를게(부모가 제어). 당신이 우릴 부르지 마",
          "전략 패턴과 차이: 템플릿 메서드는 상속으로 변형, 전략은 컴포지션으로 교체",
          "단점: 상속 기반 → 자식-부모 강결합. 리스코프 치환 원칙 위반 위험",
          "사용처: 데이터 마이닝 파이프라인, 게임 턴 진행, 테스트 프레임워크, 보고서 생성",
        ],
        csharp:
          "abstract class DataMiner {\n    // 템플릿 메서드: 흐름 고정\n    public void Mine() { OpenFile(); ExtractData(); ParseData(); Analyze(); CloseFile(); }\n    protected abstract void ExtractData(); // 반드시 구현\n    protected virtual void Analyze() { }  // 훅: 선택적 오버라이드\n    private void OpenFile() { /* 공통 */ }\n}\nclass CsvMiner : DataMiner {\n    protected override void ExtractData() { /* CSV 파싱 */ }\n}",
      },
      {
        term: "방문자 (Visitor)",
        oneliner: "구조를 바꾸지 않고 새 연산 추가. 더블 디스패치로 구현",
        category: "행동",
        detail: [
          "SOLID: OCP(새 연산 = 새 Visitor 클래스만 추가) + SRP(Element는 구조만, Visitor는 연산만)",
          "Element의 Accept(IVisitor v) 가 v.Visit(this) 호출 (더블 디스패치)",
          "IVisitor에 Visit 오버로드를 각 Element 타입별로 선언",
          "새 연산 추가 = 새 Visitor 클래스 추가 (기존 코드 수정 없음) → OCP 달성",
          "단점: Element 종류 추가 시 모든 Visitor에 새 Visit 메서드 추가 필요",
          "더블 디스패치: 타입과 방문자 두 가지 기준으로 호출 결정",
          "C#의 패턴 매칭(switch expression)으로 방문자 없이 유사 효과 구현 가능",
          "사용처: 컴파일러 AST 순회, 문서 내보내기(HTML/PDF/Markdown), 세금 계산, 렌더링",
        ],
        csharp:
          "interface IVisitor {\n    void Visit(Circle c);\n    void Visit(Rectangle r);\n}\nclass AreaCalculator : IVisitor {\n    public void Visit(Circle c) => Console.WriteLine(Math.PI * c.Radius * c.Radius);\n    public void Visit(Rectangle r) => Console.WriteLine(r.Width * r.Height);\n}\nclass Circle { public void Accept(IVisitor v) => v.Visit(this); }",
      },
      {
        term: "인터프리터 (Interpreter)",
        oneliner: "언어의 문법을 클래스로 표현하고 인터프리터로 실행",
        category: "행동",
        detail: [
          "SOLID: OCP(새 문법 규칙 = 새 Expression 클래스 추가) + SRP(각 Expression이 하나의 규칙만)",
          "문법 규칙 → 클래스 계층으로 매핑 (터미널/비터미널 표현식)",
          "Expression 트리를 재귀적으로 Interpret(context) 호출",
          "TerminalExpression: 리프 노드. 직접 값 계산",
          "NonTerminalExpression: 자식 Expression들을 조합해 해석",
          "복잡한 언어엔 파서 생성기(ANTLR, Sprache 등) 사용이 현실적",
          "LINQ 표현식 트리(Expression<Func<T, bool>>)가 대표적 구현체",
          "사용처: SQL 파서, 정규식 엔진, 수식 계산기, 설정 DSL, 검색 쿼리",
        ],
        csharp:
          "interface IExpression { int Interpret(Dictionary<string, int> ctx); }\nclass Number : IExpression {\n    int _val;\n    public int Interpret(Dictionary<string, int> _) => _val;\n}\nclass Add : IExpression {\n    IExpression _left, _right;\n    public int Interpret(Dictionary<string, int> ctx) =>\n        _left.Interpret(ctx) + _right.Interpret(ctx);\n}\nclass Variable : IExpression {\n    string _name;\n    public int Interpret(Dictionary<string, int> ctx) => ctx[_name];\n}",
      },
    ],
  },
  // ── 아키텍처 패턴 ─────────────────────────────────────────
  {
    id: "architecture",
    title: "아키텍처 패턴",
    color: "yellow",
    items: [
      {
        term: "MVC (Model-View-Controller)",
        oneliner: "모델(데이터) - 뷰(화면) - 컨트롤러(로직)로 분리",
        category: "아키텍처",
        detail: [
          "SOLID: SRP(Model·View·Controller 각각 단일 책임) + OCP(View 교체 시 Model 수정 없음)",
          "Model: 데이터와 비즈니스 로직. DB, 도메인 규칙 포함",
          "View: 화면 렌더링. 데이터 표현만 담당. 모델을 관찰해 갱신",
          "Controller: 사용자 입력 처리 → Model 업데이트 → View 결정",
          "ASP.NET Core MVC: Controller → Action → Model → View(Razor) 흐름",
          "단점: Controller가 비대해지기 쉬움 (Massive Controller). 로직이 컨트롤러에 집중",
          "해결: 서비스 레이어를 도입해 컨트롤러는 라우팅·입력 처리만 담당",
          "사용처: ASP.NET Core MVC, Spring MVC, Rails, Django",
        ],
        csharp:
          "// ASP.NET Core MVC 구조\n[ApiController]\n[Route(\"api/[controller]\")]\npublic class UsersController : ControllerBase {\n    private readonly IUserService _svc;\n    [HttpGet(\"{id}\")] // 라우팅만. 비즈니스 로직은 서비스에 위임\n    public async Task<IActionResult> Get(Guid id) {\n        var user = await _svc.GetUser(id);\n        return user is null ? NotFound() : Ok(user);\n    }\n}",
      },
      {
        term: "MVVM (Model-View-ViewModel)",
        oneliner: "뷰모델이 뷰와 모델 사이에서 바인딩 담당. WPF/모바일에 최적",
        category: "아키텍처",
        detail: [
          "SOLID: SRP(ViewModel이 View 상태와 커맨드만 담당) + DIP(View가 ViewModel 인터페이스에 의존)",
          "ViewModel: View에 바인딩될 프로퍼티 + ICommand. INotifyPropertyChanged 구현",
          "View는 ViewModel만 알고 구독. ViewModel은 View를 전혀 모름 → 테스트 쉬움",
          "양방향 데이터 바인딩: UI 입력 → ViewModel 프로퍼티, VM 변경 → UI 자동 갱신",
          "ICommand: RelayCommand/DelegateCommand 패턴으로 버튼 클릭 등 바인딩",
          "ObservableCollection<T>: 컬렉션 변경 시 View에 자동 통보",
          "MVC와 차이: MVVM은 Command+Binding으로 View-VM 결합 없음. 테스트 유리",
          "사용처: WPF, Xamarin, MAUI, WinUI, Unity UGUI, Blazor(유사)",
        ],
        csharp:
          "class UserViewModel : INotifyPropertyChanged {\n    private string _name = \"\";\n    public string Name {\n        get => _name;\n        set { _name = value; OnPropertyChanged(); }\n    }\n    public ICommand SaveCommand { get; }\n    public UserViewModel() {\n        SaveCommand = new RelayCommand(async () => await Save(), () => !string.IsNullOrEmpty(Name));\n    }\n    public event PropertyChangedEventHandler? PropertyChanged;\n    void OnPropertyChanged([CallerMemberName] string? name = null) =>\n        PropertyChanged?.Invoke(this, new(name));\n}",
      },
      {
        term: "레이어드 아키텍처",
        oneliner: "Presentation → Application → Domain → Infrastructure 계층 분리",
        category: "아키텍처",
        detail: [
          "각 레이어는 바로 아래 레이어만 참조. 위를 몰라야 함",
          "Presentation: API 컨트롤러, UI. 입출력 처리",
          "Application: 유스케이스 조율. 서비스 레이어. 트랜잭션 경계",
          "Domain: 엔티티, 값 객체, 도메인 서비스, 비즈니스 규칙. 가장 안정적",
          "Infrastructure: DB, 파일, 외부 API, 이메일. 가장 자주 바뀜",
          "단점: 단순 CRUD에 과도한 레이어. 도메인 논리가 서비스 레이어에 누출되기 쉬움",
          "클린/헥사고날 아키텍처는 레이어드의 의존 방향 문제를 DIP로 해결",
        ],
      },
      {
        term: "클린 아키텍처",
        oneliner: "의존성이 항상 내부(도메인)를 향함. 외부 세계와 도메인을 완전히 분리",
        category: "아키텍처",
        detail: [
          "SOLID: DIP(인프라가 도메인 인터페이스를 구현) + OCP(외부 교체 시 도메인 수정 없음) — SOLID의 집대성",
          "원 구조: Entities(도메인) ← Use Cases ← Interface Adapters ← Frameworks",
          "의존성 규칙: 바깥 원이 안쪽 원에만 의존. 역방향 절대 금지",
          "DB, 프레임워크, UI는 세부 사항. 언제든 교체 가능 (Plug-in Architecture)",
          "DIP 활용: 인프라가 도메인 인터페이스를 구현 (IUserRepository는 Domain에, SqlRepo는 Infrastructure에)",
          "헥사고날(Ports & Adapters)과 동일 목표: 도메인 보호 + 외부 교체 용이",
          "단점: 간단한 CRUD API에는 과설계. 진입 장벽 높음. 파일/폴더 구조 복잡",
          "사용처: 복잡한 도메인, 장기 유지보수, 여러 팀 협업 프로젝트",
        ],
      },
      {
        term: "CQRS (Command Query Responsibility Segregation)",
        oneliner: "읽기(Query)와 쓰기(Command) 모델을 완전히 분리",
        category: "아키텍처",
        detail: [
          "SOLID: SRP(읽기와 쓰기 책임 완전 분리) + OCP(새 Command/Query 핸들러 추가로 확장)",
          "Command: 상태 변경. 반환값 없음(void 또는 생성된 Id만). 부작용 있음",
          "Query: 상태 조회. 부작용 없음. 읽기 최적화 모델(DTO/뷰) 반환",
          "읽기 쓰기 독립적 확장: 쓰기는 정규화 DB, 읽기는 비정규화 뷰/캐시 사용 가능",
          "MediatR: IRequest<T> + IRequestHandler<T> 로 Command/Query 분리 구현",
          "Validation Pipeline: MediatR behavior로 커맨드 실행 전 유효성 검사 자동화",
          "EventSourcing과 조합: Command → 이벤트 저장, Query → 이벤트 재생 프로젝션",
          "단점: 단순 CRUD에 과도. 읽기/쓰기 모델 동기화 복잡. 최종 일관성 처리",
          "사용처: 고트래픽 시스템, 복잡한 비즈니스 로직, 이벤트 소싱 조합",
        ],
        csharp:
          "// Command (쓰기)\nrecord CreateOrderCommand(Guid UserId, List<OrderItem> Items) : IRequest<Guid>;\nclass CreateOrderHandler : IRequestHandler<CreateOrderCommand, Guid> {\n    public async Task<Guid> Handle(CreateOrderCommand cmd, CancellationToken ct) {\n        var order = Order.Create(cmd.UserId, cmd.Items);\n        await _repo.AddAsync(order); return order.Id;\n    }\n}\n// Query (읽기)\nrecord GetOrderQuery(Guid OrderId) : IRequest<OrderDto>;\n// 사용: var id = await _mediator.Send(new CreateOrderCommand(...));",
      },
      {
        term: "이벤트 소싱 (Event Sourcing)",
        oneliner: "상태 대신 이벤트 이력을 저장. 현재 상태는 이벤트 재생으로 도출",
        category: "아키텍처",
        detail: [
          "DB에 현재 상태 대신 OrderPlaced, ItemAdded, OrderShipped 등 이벤트 저장",
          "Apply(event) 메서드로 이벤트를 순서대로 재생해 현재 상태 복원",
          "언제든 특정 시점 상태 복원 가능 (타임 트래블 디버깅)",
          "감사 로그(Audit Log)가 무료로 생김. 누가 언제 무엇을 바꿨는지 완전 추적",
          "스냅샷: 이벤트가 너무 많아지면 주기적으로 스냅샷 저장 후 거기서 재생",
          "단점: 조회가 복잡 (CQRS 프로젝션 필요). 이벤트 스키마 변경 어려움(업캐스팅). 학습 곡선",
          "사용처: 금융(거래 이력), 전자상거래(주문 상태), 협업 도구(문서 변경 이력)",
        ],
        csharp:
          "abstract class Aggregate {\n    List<DomainEvent> _events = new();\n    protected void Apply(DomainEvent e) { _events.Add(e); When(e); }\n    protected abstract void When(DomainEvent e);\n}\nclass Order : Aggregate {\n    public OrderStatus Status { get; private set; }\n    public void Place(List<Item> items) => Apply(new OrderPlaced(Id, items));\n    protected override void When(DomainEvent e) {\n        if (e is OrderPlaced) Status = OrderStatus.Pending;\n        if (e is OrderShipped) Status = OrderStatus.Shipped;\n    }\n}",
      },
      {
        term: "마이크로서비스",
        oneliner: "기능 단위로 독립 배포 가능한 작은 서비스들의 집합",
        category: "아키텍처",
        detail: [
          "각 서비스: 독립 DB, 독립 배포, 독립 확장. 서비스 경계 = 도메인 경계",
          "통신: 동기(REST/gRPC) 또는 비동기(메시지 큐: RabbitMQ, Kafka)",
          "서비스 디스커버리, API 게이트웨이, 분산 트레이싱, 서킷 브레이커 필요",
          "데이터 일관성: 서비스 간 분산 트랜잭션 대신 Saga 패턴 사용",
          "단점: 분산 시스템 복잡도 급증. 네트워크 지연. 데이터 일관성 어려움. 운영 복잡",
          "모놀리스로 시작 → 병목/확장 필요 서비스만 점진적 분리 전략 권장",
          "사용처: 대규모 팀, 서비스별 독립 확장 필요, Netflix/Amazon 수준 트래픽",
        ],
      },
    ],
  },
  // ── 추가 패턴 ─────────────────────────────────────────────
  {
    id: "other-patterns",
    title: "실무 자주 쓰는 패턴",
    color: "white",
    items: [
      {
        term: "리포지터리 (Repository)",
        oneliner: "데이터 접근 로직을 비즈니스 로직에서 분리. DIP 달성",
        category: "아키텍처",
        detail: [
          "SOLID: SRP(데이터 접근 책임만 담당) + DIP(서비스가 IRepository 인터페이스에만 의존)",
          "IRepository<T> 인터페이스 → SqlRepo, MongoRepo, InMemoryRepo 구현 교체 가능",
          "서비스/유스케이스는 IRepository만 알면 됨. DB 종류 몰라도 됨",
          "테스트 시 InMemoryRepository로 DB 없이 빠른 단위 테스트",
          "Generic Repository vs Specific Repository: 특화 쿼리가 필요하면 specific 권장",
          "EF Core의 DbSet<T>가 사실상 리포지터리. 추가 레이어가 필요한지 신중히 결정",
          "Unit of Work 패턴과 함께 여러 리포지터리 작업을 하나의 트랜잭션으로 묶음",
          "사용처: 도메인 주도 설계, 클린 아키텍처, 테스트 가능한 데이터 접근",
        ],
        csharp:
          "interface IUserRepository {\n    Task<User?> GetByIdAsync(Guid id);\n    Task<List<User>> GetActiveUsersAsync();\n    Task AddAsync(User user);\n    Task UpdateAsync(User user);\n}\n// 테스트용\nclass InMemoryUserRepository : IUserRepository {\n    Dictionary<Guid, User> _db = new();\n    public Task<User?> GetByIdAsync(Guid id) =>\n        Task.FromResult(_db.GetValueOrDefault(id));\n    public Task AddAsync(User user) { _db[user.Id] = user; return Task.CompletedTask; }\n}",
      },
      {
        term: "Unit of Work",
        oneliner: "여러 리포지터리 작업을 하나의 트랜잭션으로 묶음",
        category: "아키텍처",
        detail: [
          "IUnitOfWork { IUserRepo Users; IOrderRepo Orders; Task<int> CommitAsync(); }",
          "Commit() 호출 시 모든 변경사항을 한 번에 DB에 원자적으로 반영",
          "Entity Framework Core의 DbContext가 UoW + Repository 역할 내장",
          "Repository가 DbContext를 공유해서 같은 트랜잭션 내에서 동작",
          "SaveChangesAsync()를 서비스 레이어에서 명시적으로 호출하는 패턴",
          "단점: 복잡도 추가. EF 사용 시 이미 UoW가 내장되어 중복 레이어가 될 수 있음",
          "사용처: 여러 엔티티를 원자적으로 저장, 도메인 이벤트를 커밋과 함께 발행",
        ],
        csharp:
          "interface IUnitOfWork {\n    IUserRepository Users { get; }\n    IOrderRepository Orders { get; }\n    Task<int> CommitAsync(CancellationToken ct = default);\n}\n// EF Core 구현\nclass AppUnitOfWork : IUnitOfWork {\n    private readonly AppDbContext _ctx;\n    public IUserRepository Users { get; }\n    public IOrderRepository Orders { get; }\n    public AppUnitOfWork(AppDbContext ctx) {\n        _ctx = ctx;\n        Users = new EfUserRepository(ctx);\n        Orders = new EfOrderRepository(ctx);\n    }\n    public Task<int> CommitAsync(CancellationToken ct) => _ctx.SaveChangesAsync(ct);\n}",
      },
      {
        term: "DI (의존성 주입)",
        oneliner: "필요한 의존성을 외부에서 주입. 강결합 제거, 테스트 쉬워짐",
        category: "아키텍처",
        detail: [
          "SOLID: DIP의 핵심 구현 수단. 상위 모듈이 하위 모듈 직접 생성 안 하고 인터페이스로 주입받음",
          "생성자 주입(Constructor): 가장 권장. 의존성이 명시적이고 불변. 테스트 쉬움",
          "속성 주입(Property): 선택적 의존성. 순환 의존성 해결에 사용. 숨겨진 의존성 위험",
          "메서드 주입(Method): 특정 메서드에만 필요한 의존성. 드물게 사용",
          "Scoped: HTTP 요청당 하나. DbContext에 적합",
          "Singleton: 앱 전체 하나. 캐시, 설정에 적합. Scoped 서비스 참조 금지",
          "Transient: 매번 새 인스턴스. 경량 서비스. 상태 없는 서비스에 적합",
          "사용처: ASP.NET Core 내장 DI, Autofac, Microsoft.Extensions.DependencyInjection",
        ],
        csharp:
          "// Program.cs 등록\nbuilder.Services.AddScoped<IUserRepository, SqlUserRepository>();\nbuilder.Services.AddSingleton<ICache, RedisCache>();\nbuilder.Services.AddTransient<IEmailService, SmtpEmailService>();\n// 생성자 주입\nclass UserService {\n    private readonly IUserRepository _repo;\n    private readonly ICache _cache;\n    public UserService(IUserRepository repo, ICache cache) {\n        _repo = repo; _cache = cache;\n    }\n}",
      },
      {
        term: "널 객체 (Null Object)",
        oneliner: "null 대신 아무것도 안 하는 기본 객체 반환. NullReferenceException 방지",
        category: "행동",
        detail: [
          "ILogger 없을 때 NullLogger.Instance 반환 → if (logger != null) 체크 불필요",
          "null 조건 연산자(?.)로도 해결 가능하지만, 호출 측 코드가 지저분해짐",
          "Microsoft.Extensions.Logging의 NullLogger<T>.Instance가 대표 사례",
          "Optional<T>: F#/Haskell의 Maybe 모나드와 유사. C#에서 구현 가능",
          "C# 8.0+ nullable reference type으로 null 전파 방지도 보완 수단",
          "단점: 실제 오류를 숨길 수 있음. 어디서 null이 발생했는지 추적 어려움",
          "사용처: 로거, 이벤트 핸들러, 기본 전략/정책 객체, 선택적 콜백",
        ],
        csharp:
          "class NullLogger : ILogger {\n    public static readonly NullLogger Instance = new();\n    public void Log(LogLevel level, string msg) { } // 아무것도 안 함\n    public bool IsEnabled(LogLevel level) => false;\n    public IDisposable BeginScope<T>(T state) => NullScope.Instance;\n}\n// 사용: null 체크 없이 안전\nvar logger = GetLogger() ?? NullLogger.Instance;\nlogger.Log(LogLevel.Info, \"test\"); // null이어도 안전",
      },
      {
        term: "명세 (Specification)",
        oneliner: "비즈니스 규칙을 객체로 캡슐화. And/Or/Not 조합 가능",
        category: "행동",
        detail: [
          "SOLID: SRP(각 명세가 하나의 규칙만) + OCP(And/Or로 새 조합 추가 시 기존 명세 수정 없음)",
          "ISpecification<T> { bool IsSatisfiedBy(T entity); Expression<Func<T, bool>> ToExpression(); }",
          "AndSpecification, OrSpecification, NotSpecification으로 조합",
          "Expression<Func<T,bool>>을 반환하면 EF Core가 SQL로 번역 가능",
          "비즈니스 규칙이 여러 곳에 흩어지지 않고 한 곳에 캡슐화",
          "리포지터리에 Specification 전달: repo.Find(new ActivePremiumSpec()) → DB WHERE 절",
          "단점: 단순 쿼리에는 과도. Expression 조합이 복잡해질 수 있음",
          "사용처: 복잡한 필터링, 할인 규칙, 권한 체크, 도메인 유효성 검사",
        ],
        csharp:
          "abstract class Specification<T> {\n    public abstract Expression<Func<T, bool>> ToExpression();\n    public bool IsSatisfiedBy(T entity) => ToExpression().Compile()(entity);\n    public Specification<T> And(Specification<T> other) => new AndSpec<T>(this, other);\n}\nclass ActiveUserSpec : Specification<User> {\n    public override Expression<Func<User, bool>> ToExpression() =>\n        u => u.IsActive && !u.IsBanned;\n}\n// 조합: var spec = new ActiveUserSpec().And(new PremiumSpec());",
      },
      {
        term: "파이프라인 (Pipeline)",
        oneliner: "요청을 일련의 핸들러로 순차 처리. 미들웨어의 일반화",
        category: "아키텍처",
        detail: [
          "ASP.NET Core 미들웨어: app.Use/Run/Map으로 파이프라인 구성",
          "MediatR Pipeline Behavior: IRequestHandler 전후에 횡단 관심사(cross-cutting) 삽입",
          "각 단계가 다음 단계를 호출할지 결정 → 책임 연쇄의 변형",
          "횡단 관심사: 로깅, 유효성 검사, 캐싱, 트랜잭션, 인증 → 비즈니스 코드에서 분리",
          "함수형 파이프라인: Func<T, T>[] 배열로 구성해 Aggregate로 조합",
          "사용처: HTTP 미들웨어, CQRS 파이프라인, ETL 데이터 변환, 이미지 처리 체인",
        ],
        csharp:
          "// MediatR 파이프라인 Behavior\nclass ValidationBehavior<TReq, TRes> : IPipelineBehavior<TReq, TRes>\n    where TReq : IRequest<TRes> {\n    private readonly IEnumerable<IValidator<TReq>> _validators;\n    public async Task<TRes> Handle(TReq req, RequestHandlerDelegate<TRes> next, CancellationToken ct) {\n        var errors = _validators.SelectMany(v => v.Validate(req).Errors).ToList();\n        if (errors.Any()) throw new ValidationException(errors);\n        return await next(); // 다음 핸들러로\n    }\n}",
      },
    ],
  },
];
