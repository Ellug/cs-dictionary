export type HotQuestionFollowUp = {
  question: string;
  modelAnswer: string[];
};

export type HotQuestion = {
  id: string;
  question: string;
  oneLiner: string;
  difficulty: "기초" | "중급" | "심화";
  keywords: string[];
  modelAnswer: string[];
  followUps: HotQuestionFollowUp[];
};

export type HotQuestionSection = {
  id: string;
  title: string;
  color: "yellow" | "red" | "white";
  items: HotQuestion[];
};

export const hotQuestionSections: HotQuestionSection[] = [
  {
    id: "runtime-csharp",
    title: "C# / 런타임 / 메모리",
    color: "yellow",
    items: [
      {
        id: "unity-dotnet-gc",
        question: "Unity의 GC와 일반 .NET 서버 애플리케이션 GC의 관점 차이를 설명해보세요.",
        oneLiner: "게임은 평균 처리량보다 프레임 스파이크 억제가 더 중요하다.",
        difficulty: "중급",
        keywords: ["GC", "Unity", ".NET", "프레임 타임", "할당 최적화"],
        modelAnswer: [
          "둘 다 가비지 컬렉션을 수행하지만, 서버는 처리량(throughput), 게임 클라는 프레임 안정성(P99 latency)이 우선입니다.",
          "Unity에서는 짧은 프레임 루프에서 작은 할당이 반복되면 GC 타이밍에 hitch(끊김)로 체감됩니다.",
          "그래서 GC 옵션보다 먼저 per-frame 할당 제거(Object Pool, NativeArray, 버퍼 재사용)를 설계합니다.",
          "Incremental GC는 긴 멈춤을 분할해 완화하지만 총 GC 작업량이 사라지는 것은 아니므로 할당 패턴 개선이 본질입니다.",
        ],
        followUps: [
          {
            question: "그럼 `GC.Collect()`를 로딩 화면에서 강제로 호출하는 건 괜찮나요?",
            modelAnswer: [
              "사용자 입력이 없는 전환 구간에서 제한적으로는 가능하지만 상시 전략으로 쓰면 안 됩니다.",
              "핵심은 강제 수집이 아니라 수집할 쓰레기를 덜 만드는 구조로 바꾸는 것입니다.",
            ],
          },
          {
            question: "Unity에서 GC 병목을 어떻게 확인하나요?",
            modelAnswer: [
              "Profiler에서 GC Alloc 컬럼과 프레임 타임 스파이크를 먼저 상관관계로 확인합니다.",
              "호출 스택을 내려가며 `new`, LINQ, 문자열 생성, boxing 구간을 핫스팟으로 줄입니다.",
            ],
          },
        ],
      },
      {
        id: "gc-lifecycle",
        question: "GC 생명주기를 할당부터 수거까지 단계별로 설명해보세요.",
        oneLiner: "할당 → 루트 스캔/마킹 → 수집/승격 → 후처리 흐름을 말하면 된다.",
        difficulty: "기초",
        keywords: ["GC 생명주기", "root", "generation", "mark", "sweep"],
        modelAnswer: [
          "객체는 힙에 할당되고, GC 시점에 GC Root에서 도달 가능한 객체를 마킹합니다.",
          "도달 불가능 객체를 회수하고 생존 객체는 세대별 정책에 따라 승격됩니다.",
          "필요 시 finalizer 큐를 처리하고 단편화 완화 작업이 뒤따릅니다.",
          "면접에서는 '수집 호출'보다 '할당 패턴 제어'가 핵심이라는 결론까지 연결하면 좋습니다.",
        ],
        followUps: [
          {
            question: "LOH는 왜 신경 써야 하나요?",
            modelAnswer: [
              "대형 객체는 LOH에서 관리되며 수집/압축 특성이 달라 단편화와 긴 수집 시간에 영향을 줄 수 있습니다.",
              "큰 배열의 반복 생성/폐기를 피하고 풀링으로 완화하는 전략을 같이 말하면 좋습니다.",
            ],
          },
        ],
      },
      {
        id: "string-immutability",
        question: "C#에서 String이 불변 객체인 이유에 대해 설명해주세요.",
        oneLiner: "문자열 공유, 해시 안정성, 스레드 안전성, 런타임 최적화를 위해 한 번 만든 문자열은 바꾸지 않는다.",
        difficulty: "중급",
        keywords: ["string", "System.String", "불변 객체", "intern", "StringBuilder", "GC"],
        modelAnswer: [
          "C#의 string은 System.String의 별칭이며 참조 타입이지만, 한 번 생성된 문자열의 내용은 변경할 수 없는 불변 객체입니다.",
          "문자열을 수정하는 것처럼 보이는 `Replace`, `Substring`, `+` 연산은 기존 객체를 바꾸는 것이 아니라 새 string 객체를 만듭니다.",
          "불변이면 여러 코드가 같은 문자열 참조를 공유해도 누군가 내용물을 바꿔 다른 코드가 영향을 받는 문제가 없습니다.",
          "또한 string을 Dictionary 키로 사용할 때 해시 값과 동등성 결과가 안정적으로 유지됩니다. 키가 바뀌면 해시 테이블의 버킷 위치가 깨질 수 있습니다.",
          "string interning처럼 동일한 리터럴을 하나의 인스턴스로 공유하는 최적화도 불변성이 전제라서 안전합니다.",
          "읽기 전용 공유가 가능하므로 스레드 간 전달도 비교적 안전하며, 복사 대신 참조 공유로 메모리를 아낄 수 있습니다.",
          "대신 반복 연결은 매번 새 문자열과 복사를 만들 수 있어 GC 압박과 O(n^2) 비용이 생기므로 루프에서는 StringBuilder, string.Create, Span/버퍼 재사용을 고려합니다.",
        ],
        followUps: [
          {
            question: "string이 참조 타입인데 왜 값 타입처럼 비교되는 것처럼 보이나요?",
            modelAnswer: [
              "string은 참조 타입이지만 `==` 연산자가 내용 비교로 오버로드되어 있습니다.",
              "따라서 `a == b`는 보통 문자열 내용 비교이고, 참조 동일성을 보고 싶다면 ReferenceEquals(a, b)를 사용합니다.",
              "단, object로 업캐스팅된 뒤 `==`를 쓰면 object의 참조 비교 규칙이 적용될 수 있어 Equals 사용이 더 명확합니다.",
            ],
          },
          {
            question: "반복문에서 `str += value`가 왜 성능 문제가 되나요?",
            modelAnswer: [
              "string은 불변이므로 `+=`는 기존 버퍼에 덧붙이는 것이 아니라 새 문자열을 만들고 기존 내용과 새 내용을 복사합니다.",
              "반복 횟수가 많아질수록 누적 복사량이 커져 O(n^2)에 가까운 비용이 발생할 수 있습니다.",
              "게임 클라이언트에서는 프레임마다 문자열을 만들면 GC Alloc과 프레임 스파이크로 이어지기 쉬우므로 StringBuilder나 재사용 버퍼를 씁니다.",
            ],
          },
          {
            question: "StringBuilder는 string과 무엇이 다른가요?",
            modelAnswer: [
              "StringBuilder는 내부 버퍼를 가진 가변 객체라 Append 시 매번 최종 string을 새로 만들지 않습니다.",
              "여러 번 조립한 뒤 마지막에 ToString()으로 한 번만 string을 생성하는 용도에 적합합니다.",
              "단순한 2~3개 문자열 결합은 컴파일러/JIT 최적화가 잘 되므로 무조건 StringBuilder가 빠르다고 보면 안 됩니다.",
            ],
          },
          {
            question: "string interning과 불변성은 어떤 관계가 있나요?",
            modelAnswer: [
              "interning은 같은 내용의 문자열 리터럴을 하나의 인스턴스로 공유하는 최적화입니다.",
              "만약 문자열이 가변이라면 한 참조에서 내용을 바꿨을 때 같은 intern 객체를 공유하는 모든 코드가 영향을 받으므로 안전하지 않습니다.",
              "따라서 intern pool은 string이 불변이라는 전제 위에서 동작합니다.",
            ],
          },
          {
            question: "string을 Dictionary 키로 자주 쓰는 이유는 무엇인가요?",
            modelAnswer: [
              "string은 불변이라 삽입 후 내용과 해시 코드 의미가 바뀌지 않아 해시 테이블 키로 안전합니다.",
              "키가 가변 객체라 삽입 후 Equals/GetHashCode 결과가 바뀌면 Dictionary가 해당 키를 찾지 못할 수 있습니다.",
              "그래서 키 타입은 불변 값, 식별자, record처럼 동등성 기준이 안정적인 타입이 적합합니다.",
            ],
          },
          {
            question: "비밀번호나 토큰을 string으로 오래 들고 있으면 어떤 문제가 있나요?",
            modelAnswer: [
              "string은 불변이라 내용을 덮어써서 지울 수 없고, GC가 수거하기 전까지 메모리에 남을 수 있습니다.",
              "또한 substring, logging, exception message 같은 경로로 의도치 않게 복사본이 생길 수 있습니다.",
              "민감 데이터는 가능하면 생명주기를 짧게 유지하고, 필요 시 byte[]/char[] 같은 지울 수 있는 버퍼와 로깅 마스킹을 고려합니다.",
            ],
          },
          {
            question: "Unity에서 string 불변성과 관련된 실무 이슈는 무엇인가요?",
            modelAnswer: [
              "Update 루프의 문자열 보간, Debug.Log 메시지 조립, UI 텍스트 반복 갱신은 매 프레임 새 string을 만들 수 있습니다.",
              "Profiler의 GC Alloc으로 확인하고, 값이 바뀔 때만 갱신하거나 StringBuilder/캐시/TMP SetText 계열 API를 사용해 할당을 줄입니다.",
              "핵심은 string 자체가 나쁜 것이 아니라 hot path에서 반복 생성되는 패턴을 제거하는 것입니다.",
            ],
          },
        ],
      },
      {
        id: "generic-deep",
        question: "제네릭이 성능과 설계 측면에서 왜 중요한지 설명해보세요.",
        oneLiner: "타입 안정성과 박싱 제거를 동시에 얻는 핵심 도구다.",
        difficulty: "중급",
        keywords: ["제네릭", "boxing", "where 제약", "IEquatable", "DI open generic"],
        modelAnswer: [
          "제네릭은 컴파일 타임 타입 안정성을 보장하면서 object 기반 캐스팅/박싱 비용을 줄입니다.",
          "where 제약으로 API 계약을 명확히 하여 잘못된 타입 사용을 사전에 막을 수 있습니다.",
          "값 타입 컬렉션(List<int>)은 박싱을 피해 GC 압박이 줄어듭니다.",
          "실무에서는 Open Generic(IRepository<T>) 등록 등으로 구현 중복을 줄이는 데도 효과적입니다.",
        ],
        followUps: [
          {
            question: "공변/반변은 언제 쓰나요?",
            modelAnswer: [
              "반환 중심 인터페이스(IEnumerable<out T>)는 공변, 입력 중심 인터페이스(IComparer<in T>)는 반변으로 이해합니다.",
              "API 유연성을 높이되 잘못된 변성 사용으로 타입 안전성이 깨지지 않게 제약을 지킵니다.",
            ],
          },
        ],
      },
      {
        id: "foreach-internals",
        question: "C# `foreach`의 내부 동작을 설명하고 성능 이슈를 말해보세요.",
        oneLiner: "GetEnumerator/MoveNext/Current + Dispose 패턴으로 변환된다.",
        difficulty: "중급",
        keywords: ["foreach", "IEnumerator", "Dispose", "boxing", "iterator"],
        modelAnswer: [
          "컴파일러는 `foreach`를 열거자 획득 후 `MoveNext` 루프로 변환합니다.",
          "열거자가 IDisposable이면 try/finally로 Dispose 호출이 보장됩니다.",
          "배열은 인덱스 루프로 최적화될 수 있지만, 인터페이스 업캐스팅 시 boxing이 생길 수 있습니다.",
          "순회 중 컬렉션 구조 변경 시 `Collection was modified` 예외가 발생하므로 상태 변경 위치를 분리해야 합니다.",
        ],
        followUps: [
          {
            question: "그럼 `for`가 항상 `foreach`보다 빠른가요?",
            modelAnswer: [
              "항상은 아닙니다. 배열/리스트는 JIT 최적화가 잘 되어 차이가 작을 때가 많습니다.",
              "핵심은 추상화 계층(인터페이스/박싱/람다 캡처)으로 인한 추가 비용 여부입니다.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "algo-coding",
    title: "알고리즘 / 코테",
    color: "red",
    items: [
      {
        id: "bfs-dfs-choice",
        question: "BFS와 DFS 중 어떤 상황에서 무엇을 선택하나요?",
        oneLiner: "최단 단계면 BFS, 상태 전수·백트래킹이면 DFS가 기본이다.",
        difficulty: "기초",
        keywords: ["BFS", "DFS", "최단거리", "백트래킹"],
        modelAnswer: [
          "무가중치 최단 거리/최소 횟수 문제는 BFS가 정답 보장을 합니다.",
          "경로 전수, 조합 탐색, 가지치기 기반 탐색은 DFS/백트래킹이 적합합니다.",
          "둘 다 이론상 O(V+E)이지만 메모리 형태(너비 vs 깊이)가 다르므로 입력 특성에 따라 선택합니다.",
          "면접에서는 선택 이유를 '문제 목적' 기준으로 설명해야 점수를 받습니다.",
        ],
        followUps: [
          {
            question: "가중치가 0/1이면?",
            modelAnswer: [
              "Deque를 쓰는 0-1 BFS를 적용하면 다익스트라보다 단순하고 빠를 수 있습니다.",
              "일반 양의 가중치는 다익스트라, 음수 간선은 벨만-포드를 고려합니다.",
            ],
          },
        ],
      },
      {
        id: "dijkstra-floyd-bellman",
        question: "다익스트라, 플로이드-워셜, 벨만-포드의 선택 기준을 설명해보세요.",
        oneLiner: "간선 부호와 질의 형태(단일 시작점 vs 모든 쌍)로 고른다.",
        difficulty: "중급",
        keywords: ["다익스트라", "플로이드", "벨만포드", "음수 간선"],
        modelAnswer: [
          "다익스트라는 음수 간선이 없고 단일 시작점 최단거리일 때 표준 선택입니다.",
          "벨만-포드는 음수 간선/음수 사이클 감지가 필요할 때 사용합니다.",
          "플로이드-워셜은 정점 수가 작고 모든 쌍 최단거리가 필요할 때 적합합니다.",
          "복잡도와 메모리뿐 아니라 입력 제한(V, E, 질의 수)을 함께 근거로 제시해야 합니다.",
        ],
        followUps: [
          {
            question: "왜 다익스트라는 음수 간선에서 깨지나요?",
            modelAnswer: [
              "한 번 확정한 최단거리가 이후 음수 간선으로 더 줄어들 수 있어 탐욕적 확정 가정이 무너집니다.",
            ],
          },
        ],
      },
      {
        id: "procedural-map-interview",
        question: "절차적 맵 생성에서 Perlin Noise와 BSP를 어떻게 조합하겠습니까?",
        oneLiner: "거시 구조는 BSP, 미시 디테일은 노이즈로 분리하면 제어성과 자연스러움을 같이 얻는다.",
        difficulty: "심화",
        keywords: ["절차적 생성", "Perlin", "BSP", "던전", "지형"],
        modelAnswer: [
          "BSP로 먼저 룸/복도 같은 플레이 가능한 토폴로지를 확보합니다.",
          "그 위에 Perlin/FBM 노이즈로 높낮이, 바이옴, 디테일 패턴을 입혀 자연스러움을 보강합니다.",
          "마지막에 연결성 BFS 검증과 필수 룸 제약(스폰/보스/상점)을 적용해 품질을 보정합니다.",
          "이 접근은 완전 랜덤보다 디자이너 의도와 재현성(seed)을 함께 만족시킵니다.",
        ],
        followUps: [
          {
            question: "생성 품질을 어떻게 자동 검수하나요?",
            modelAnswer: [
              "도달 가능성, 평균 경로 길이, dead-end 비율 같은 메트릭을 정의해 기준 미달 맵을 재생성합니다.",
            ],
          },
        ],
      },
      {
        id: "clustering-game-usage",
        question: "군집 알고리즘을 게임 데이터 분석에 적용한다면 어떤 사례가 있나요?",
        oneLiner: "플레이어 행동/이탈 패턴 분류에 K-Means 같은 군집화를 실무적으로 쓴다.",
        difficulty: "중급",
        keywords: ["군집", "K-Means", "Boids", "데이터 분석", "밸런스"],
        modelAnswer: [
          "세션 길이, 과금, 사망 위치, 반복 행동을 피처로 만들어 플레이어 군집을 분리할 수 있습니다.",
          "군집별 튜토리얼, 난이도, 보상 정책을 다르게 적용해 이탈률 개선 실험을 설계합니다.",
          "K 값 선정은 엘보우/실루엣 지표와 도메인 해석 가능성을 함께 봅니다.",
          "실시간 군중 움직임에서는 Boids처럼 규칙 기반 군집 알고리즘을 시뮬레이션에 직접 적용할 수 있습니다.",
        ],
        followUps: [
          {
            question: "K-Means의 한계는 무엇인가요?",
            modelAnswer: [
              "K를 사전에 정해야 하고 초기 중심점에 민감하며 비구형 분포 데이터에서는 성능이 낮을 수 있습니다.",
              "그래서 DBSCAN/HDBSCAN 같은 대안을 병행 검토하기도 합니다.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "unity-rendering",
    title: "Unity 렌더링 / 성능",
    color: "red",
    items: [
      {
        id: "drawcall-setpass-srpbatcher",
        question: "Draw Call, SetPass Call, SRP Batcher의 차이와 우선 최적화 포인트를 설명해보세요.",
        oneLiner: "숫자 자체보다 상태 전환 비용(SetPass)과 병목 위치를 먼저 봐야 한다.",
        difficulty: "심화",
        keywords: ["Draw Call", "SetPass", "SRP Batcher", "Unity 최적화"],
        modelAnswer: [
          "Draw Call은 명령 제출 단위이고 SetPass는 셰이더/파이프라인 상태 전환이라 CPU 비용이 더 큰 경우가 많습니다.",
          "SRP Batcher는 SRP 호환 셰이더의 상수 버퍼 경로를 최적화해 제출 비용을 줄입니다.",
          "그래서 단순히 Draw 수만 줄이기보다 머티리얼/셰이더 종류를 줄여 SetPass를 먼저 낮추는 전략이 효과적입니다.",
          "Profiler로 CPU/GPU bound를 확인한 뒤, 배칭/인스턴싱/오버드로우 최적화를 우선순위로 나눕니다.",
        ],
        followUps: [
          {
            question: "SRP Batcher와 GPU Instancing은 같은 건가요?",
            modelAnswer: [
              "아닙니다. Instancing은 동일 메시/머티리얼 다중 오브젝트를 묶는 기법이고, SRP Batcher는 제출 경로 효율화입니다.",
              "둘은 상호 배타가 아니라 조건에 따라 함께 효과를 낼 수 있습니다.",
            ],
          },
        ],
      },
      {
        id: "cpu-gpu-bound",
        question: "CPU bound와 GPU bound를 어떻게 구분하고 각각 어떤 최적화를 하시겠어요?",
        oneLiner: "먼저 병목을 분리한 뒤 그 영역에 맞는 처방을 해야 한다.",
        difficulty: "중급",
        keywords: ["CPU bound", "GPU bound", "Profiler", "Frame Debugger"],
        modelAnswer: [
          "메인/렌더 스레드 시간이 길면 CPU bound, GPU frame 시간이 길면 GPU bound로 판단합니다.",
          "CPU bound는 스크립트 비용, 배칭, 메모리 할당, 물리 업데이트를 우선 줄입니다.",
          "GPU bound는 오버드로우, 쉐이더 복잡도, 포스트 프로세스, 해상도 스케일링을 우선 최적화합니다.",
          "Frame Debugger/RenderDoc으로 실제 드로우 경로를 보고 원인 가설을 검증합니다.",
        ],
        followUps: [
          {
            question: "드로우콜이 낮은데도 느릴 수 있나요?",
            modelAnswer: [
              "가능합니다. 비싼 픽셀 셰이더나 과도한 포스트 프로세스로 GPU가 병목이면 draw 수만으로 설명되지 않습니다.",
            ],
          },
        ],
      },
      {
        id: "object-pooling",
        question: "오브젝트 풀링을 언제 적용하고, 실패하는 경우는 어떤 경우인가요?",
        oneLiner: "생성/파괴가 잦고 생명주기가 짧은 객체를 재사용해 할당, GC, 초기화 비용을 줄인다.",
        difficulty: "중급",
        keywords: ["Object Pool", "Generic", "Stack", "Queue", "Boxing", "Fragmentation", "GC Alloc"],
        modelAnswer: [
          "오브젝트 풀링은 객체를 매번 생성/파괴하지 않고 미리 만들거나 필요 시 만든 뒤 반납받아 재사용하는 기법입니다.",
          "탄환, 이펙트, 데미지 텍스트, 임시 UI, StringBuilder, byte[] 버퍼처럼 생성 빈도가 높고 생명주기가 짧은 객체에서 효과가 큽니다.",
          "핵심 효과는 할당 횟수 감소, GC Alloc 감소, Instantiate/Destroy 초기화 비용 감소, 메모리 사용 패턴 안정화입니다.",
          "구현은 보통 `ObjectPool<T>`처럼 제네릭으로 만들고, 내부 자료구조는 LIFO 재사용성이 좋은 `Stack<T>`나 순서를 보장하기 쉬운 `Queue<T>`를 선택합니다.",
          "값 타입이나 ID를 `object` 컬렉션에 넣는 식으로 풀을 만들면 박싱/언박싱이 생기므로 `Stack<T>`, `List<T>`, `Dictionary<int, T>` 같은 제네릭 컬렉션을 써야 합니다.",
          "반납 시 active 플래그, Transform, 이벤트 구독, 코루틴, 타이머, 소유자 참조, 민감 데이터 등을 초기화하지 않으면 이전 사용자의 상태가 새 사용자에게 새는 버그가 납니다.",
          "풀 크기 상한과 초과 반납 정책이 없으면 메모리 점유가 계속 증가할 수 있으므로 초기 크기, max size, warm-up, shrink 정책을 정해야 합니다.",
          "풀링은 메모리 단편화를 완전히 없애는 기술은 아니지만, 같은 크기 객체를 반복 재사용하면 할당/해제 패턴이 안정되어 단편화와 GC 빈도를 줄이는 데 도움이 됩니다.",
          "Profiler로 실제 할당 병목이 확인된 뒤 적용해야 하며, 저빈도 객체나 상태가 복잡한 객체까지 과도하게 풀링하면 메모리 상주 비용과 버그 가능성이 더 커집니다.",
        ],
        followUps: [
          {
            question: "Addressables와 풀링을 같이 쓸 때 주의점은?",
            modelAnswer: [
              "참조 카운트 해제 시점과 풀 보관 객체의 생명주기가 충돌하지 않게 ownership을 명확히 해야 합니다.",
              "풀에 아직 인스턴스가 남아 있는데 원본 Addressable 핸들을 release하면 다음 재사용 시 missing reference나 재로드 비용이 발생할 수 있습니다.",
              "풀 자체가 에셋 핸들을 소유하는지, 씬/스폰 시스템이 소유하는지 정책을 정하고 Dispose/ReleaseAll 단계에서 한 번에 정리합니다.",
            ],
          },
          {
            question: "제네릭 `ObjectPool<T>`로 구현하면 어떤 장점이 있나요?",
            modelAnswer: [
              "타입별 풀을 컴파일 타임에 분리할 수 있어 잘못된 타입 반납이나 캐스팅 오류를 줄입니다.",
              "`object` 기반 풀과 달리 값 타입이나 핸들 구조체를 다룰 때 박싱/언박싱을 피할 수 있습니다.",
              "`Func<T> create`, `Action<T> onGet`, `Action<T> onRelease`, `Action<T> onDestroy` 같은 훅을 주면 생성/초기화/반납 규약을 타입별로 강제할 수 있습니다.",
            ],
          },
          {
            question: "풀 내부 자료구조는 Stack, Queue, List 중 무엇이 적합한가요?",
            modelAnswer: [
              "`Stack<T>`는 마지막에 반납한 객체를 다시 꺼내므로 CPU 캐시 지역성이 좋고 구현이 단순해 일반적인 풀에 많이 씁니다.",
              "`Queue<T>`는 오래 대기한 객체부터 재사용하므로 사용 빈도를 고르게 분산하고 싶을 때 선택할 수 있습니다.",
              "`List<T>`는 임의 제거나 전체 순회에는 유리하지만 단순 Get/Return 풀에는 Stack/Queue보다 의도가 덜 명확할 수 있습니다.",
              "중복 반납 검출이 필요하면 개발 빌드에서 `HashSet<T>`를 같이 둬 double return을 잡는 식으로 보완합니다.",
            ],
          },
          {
            question: "오브젝트 풀링과 박싱/언박싱은 어떻게 연결되나요?",
            modelAnswer: [
              "풀 자체를 `Stack<object>`나 `ArrayList`로 만들면 값 타입을 넣을 때 박싱되고 꺼낼 때 언박싱/캐스팅이 필요합니다.",
              "이러면 풀링으로 할당을 줄이려다 박싱 할당을 새로 만드는 모순이 생깁니다.",
              "타입별 `ObjectPool<T>`, `Stack<T>`, `List<T>`를 사용하고, 값 타입 비교는 `IEquatable<T>`나 `EqualityComparer<T>.Default`를 활용해 박싱을 피합니다.",
            ],
          },
          {
            question: "내부 단편화와 외부 단편화 차이를 설명하고 풀링과 연결해보세요.",
            modelAnswer: [
              "내부 단편화는 할당받은 블록 안에서 실제 사용하지 않는 낭비 공간입니다. 예를 들어 100B가 필요한데 128B 슬롯을 받으면 남는 28B가 내부 단편화입니다.",
              "외부 단편화는 전체 여유 메모리는 충분하지만 작은 빈 공간들이 흩어져 큰 연속 블록을 할당하지 못하는 상태입니다.",
              "고정 크기 슬롯 풀은 외부 단편화를 줄이는 대신 슬롯 크기보다 작은 객체에서 내부 단편화를 만들 수 있습니다.",
              ".NET 관리 힙은 GC 압축으로 일반 힙 단편화를 완화하지만, 큰 객체가 들어가는 LOH나 네이티브/엔진 메모리는 단편화 이슈가 더 두드러질 수 있습니다.",
            ],
          },
          {
            question: "풀링이 오히려 실패하는 대표 사례는 무엇인가요?",
            modelAnswer: [
              "객체 상태 초기화가 복잡해 반납 누락, 이벤트 구독 누수, 코루틴 잔존 같은 유령 상태 버그가 생기는 경우입니다.",
              "한 번에 최대 사용량이 매우 큰데 풀을 줄이지 않아 피크 메모리를 계속 붙잡는 경우도 실패입니다.",
              "생성 비용이 낮고 빈도가 낮은 객체까지 풀링하면 성능 이득보다 코드 복잡도와 메모리 상주 비용이 커집니다.",
              "Unity에서는 비활성 GameObject도 Transform 계층, 컴포넌트 참조, 에셋 참조를 유지하므로 풀에 쌓인 객체가 실제 메모리를 계속 잡을 수 있습니다.",
            ],
          },
          {
            question: "풀 크기는 어떻게 정하나요?",
            modelAnswer: [
              "동시 활성 객체 수의 평균/피크를 Profiler와 게임 로그로 측정해 초기 용량과 최대 용량을 정합니다.",
              "전투 시작 전 warm-up으로 첫 스폰 hitch를 줄이고, 전투 종료 후 일정 기준 이상은 파괴하거나 Addressables release 대상으로 넘길 수 있습니다.",
              "정답 숫자는 없고, 프레임 스파이크 감소와 메모리 상주량 사이의 트레이드오프를 지표로 결정합니다.",
            ],
          },
          {
            question: "멀티스레드 환경에서도 같은 풀을 공유해도 되나요?",
            modelAnswer: [
              "일반적인 `Stack<T>` 기반 풀은 스레드 안전하지 않으므로 lock, ConcurrentQueue/ConcurrentBag, 스레드 로컬 풀 등을 고려해야 합니다.",
              "다만 UnityEngine.Object, GameObject, Transform은 대부분 메인 스레드 접근 전제라 백그라운드 스레드에서 직접 Get/Return 후 Unity API를 호출하면 위험합니다.",
              "백그라운드에서는 byte[]나 순수 데이터 버퍼 풀을 사용하고, 씬 객체 풀은 메인 스레드에서 관리하는 식으로 나누는 것이 안전합니다.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "architecture-patterns",
    title: "아키텍처 / 패턴 / 시스템 설계",
    color: "yellow",
    items: [
      {
        id: "solid-game-client",
        question: "게임 클라이언트에서 SOLID를 적용한 사례를 설명해보세요.",
        oneLiner: "추상화·책임 분리로 기능 추가 시 파급 범위를 줄이는 게 핵심이다.",
        difficulty: "중급",
        keywords: ["SOLID", "SRP", "DIP", "OCP", "아키텍처"],
        modelAnswer: [
          "예를 들어 매치메이킹 서비스에서 네트워크 호출, 응답 파싱, UI 갱신을 분리해 SRP를 지켰습니다.",
          "전송 계층은 `IMatchApi` 추상화로 의존해 REST→gRPC 교체 시 상위 로직을 수정하지 않게 했습니다(DIP/OCP).",
          "정책 확장이 필요한 부분은 전략 인터페이스를 두고 구현체 등록으로 확장했습니다.",
          "결과적으로 신규 기능 추가 시 테스트 범위와 회귀 리스크를 국소화할 수 있었습니다.",
        ],
        followUps: [
          {
            question: "SOLID를 과하게 적용하면 생기는 문제는?",
            modelAnswer: [
              "인터페이스/레이어가 과도해져 학습 비용과 호출 추적 복잡도가 커질 수 있습니다.",
              "팀 규모와 변경 빈도에 맞춰 '필요한 만큼만' 적용하는 균형이 중요합니다.",
            ],
          },
        ],
      },
      {
        id: "fsm-vs-state",
        question: "FSM과 상태 패턴(State Pattern)의 차이를 설명해보세요.",
        oneLiner: "FSM은 모델, 상태 패턴은 그 모델을 코드로 조직하는 구현 방식에 가깝다.",
        difficulty: "중급",
        keywords: ["FSM", "State Pattern", "전이", "AI"],
        modelAnswer: [
          "FSM은 상태/이벤트/전이 규칙으로 시스템을 모델링하는 개념입니다.",
          "상태 패턴은 각 상태를 객체로 분리해 동작을 위임하는 OOP 구현 방식입니다.",
          "작은 시스템은 enum+전이 테이블이 단순하고, 확장성이 필요한 경우 상태 패턴이 유지보수에 유리합니다.",
          "복잡도가 더 커지면 HFSM이나 Behavior Tree 같은 상위 모델을 고려합니다.",
        ],
        followUps: [
          {
            question: "언제 enum 기반 FSM 대신 상태 객체로 바꾸나요?",
            modelAnswer: [
              "상태별 로직이 길어지고 전이 조건이 얽혀 switch가 비대해질 때 전환합니다.",
              "테스트 단위와 변경 단위를 상태 객체로 쪼개는 순간 이점이 큽니다.",
            ],
          },
        ],
      },
      {
        id: "atomic-design",
        question: "아토믹 디자인을 실무 UI 구조에 적용할 때의 장점과 주의점을 말해보세요.",
        oneLiner: "재사용성과 협업 효율이 올라가지만, 과분해하면 오히려 복잡해진다.",
        difficulty: "중급",
        keywords: ["Atomic Design", "UI 아키텍처", "디자인 시스템"],
        modelAnswer: [
          "Atom/Molecule/Organism 계층으로 컴포넌트를 나누면 재사용성과 변경 영향 분석이 쉬워집니다.",
          "Template/Page 분리로 레이아웃 책임과 데이터 주입 책임을 분리할 수 있습니다.",
          "디자인 토큰(색상/타이포/간격)과 함께 관리하면 디자이너-개발자 협업 비용이 줄어듭니다.",
          "단, 과도한 분해는 추적 복잡도를 높이므로 팀 컨벤션에 맞는 적정 granularity가 중요합니다.",
        ],
        followUps: [
          {
            question: "아토믹 디자인과 상태 관리의 경계는 어떻게 잡나요?",
            modelAnswer: [
              "하위 Atom은 가능한 dumb component로 유지하고, 상태/사이드이펙트는 상위 Organism 또는 container로 올립니다.",
            ],
          },
        ],
      },
      {
        id: "dod-vs-oop",
        question: "데이터 주도 설계(DOD)와 OOP를 언제 어떻게 혼용하겠습니까?",
        oneLiner: "핫패스는 DOD, 비즈니스 규칙/툴링은 OOP로 분리하는 하이브리드가 실무적이다.",
        difficulty: "심화",
        keywords: ["DOD", "OOP", "ECS", "캐시 효율"],
        modelAnswer: [
          "대량 반복 연산(이동/충돌/군중)은 캐시 효율이 핵심이라 DOD/ECS가 유리합니다.",
          "반면 도메인 규칙, 에디터 툴, UI 흐름은 OOP의 캡슐화/추상화 이점이 큽니다.",
          "실무에서는 연산 경로(hot path)와 관리 경로(cold path)를 분리해 하이브리드로 설계합니다.",
          "면접에서는 '무조건 DOD'가 아니라 병목 기반 선택이라는 점을 강조하는 것이 좋습니다.",
        ],
        followUps: [
          {
            question: "DOD 적용 전후를 어떻게 측정하나요?",
            modelAnswer: [
              "프레임 타임, L1/L2 캐시 미스, 메모리 대역폭, GC Alloc 지표를 기준으로 A/B 프로파일링합니다.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "data-structures-core",
    title: "자료구조 선택 / 구현",
    color: "white",
    items: [
      {
        id: "array-list-linkedlist",
        question: "Array, List, LinkedList의 차이와 선택 기준을 설명해보세요.",
        oneLiner: "접근 패턴, 삽입/삭제 위치, 캐시 효율을 기준으로 선택한다.",
        difficulty: "기초",
        keywords: ["Array", "List", "LinkedList", "캐시 지역성", "시간복잡도"],
        modelAnswer: [
          "Array는 고정 크기이고 인덱스 접근이 O(1)이며 메모리가 연속되어 캐시 효율이 좋습니다.",
          "List<T>는 동적 배열이라 끝 삽입은 amortized O(1), 중간 삽입/삭제는 이동 비용 때문에 O(n)입니다.",
          "LinkedList<T>는 노드를 알고 있으면 삽입/삭제가 O(1)이지만 임의 접근이 O(n)이고 캐시 효율이 나쁩니다.",
          "실무에서는 순회와 인덱스 접근이 많으면 List/Array, 노드 참조 기반 중간 삽입이 핵심이면 LinkedList를 검토합니다.",
        ],
        followUps: [
          {
            question: "LinkedList는 삽입/삭제가 빠른데 왜 실무에서 덜 쓰이나요?",
            modelAnswer: [
              "삽입 위치를 찾는 비용이 O(n)이고 노드가 힙에 흩어져 캐시 미스가 많습니다.",
              "대부분의 실제 workload에서는 연속 메모리의 List가 더 빠른 경우가 많습니다.",
            ],
          },
        ],
      },
      {
        id: "arraylist-vs-list",
        question: "ArrayList와 List<T>의 차이를 설명해보세요.",
        oneLiner: "ArrayList는 object 기반 레거시 컬렉션이고, List<T>는 타입 안전한 제네릭 컬렉션이다.",
        difficulty: "중급",
        keywords: ["ArrayList", "List<T>", "제네릭", "박싱", "타입 안정성", "GC"],
        modelAnswer: [
          "ArrayList는 비제네릭 컬렉션이라 내부에 요소를 object로 저장합니다.",
          "List<T>는 제네릭 컬렉션이라 컴파일 타임에 요소 타입을 고정하고 타입 안정성을 보장합니다.",
          "ArrayList에 int 같은 값 타입을 넣으면 박싱이 발생하고, 꺼낼 때 언박싱과 캐스팅이 필요합니다.",
          "List<int>는 int를 그대로 다루므로 박싱/언박싱 비용과 런타임 캐스팅 오류 위험이 줄어듭니다.",
          "그래서 새 코드에서는 특별한 레거시 호환 이유가 없으면 ArrayList보다 List<T>를 선택하는 것이 일반적입니다.",
        ],
        followUps: [
          {
            question: "ArrayList가 object를 받으면 더 유연한데 왜 문제가 되나요?",
            modelAnswer: [
              "여러 타입을 섞어 넣을 수 있다는 유연성은 컴파일 타임 검증을 포기한다는 뜻입니다.",
              "꺼내는 쪽에서 매번 캐스팅해야 하며, 잘못된 타입이 들어간 경우 런타임 예외로 늦게 터집니다.",
            ],
          },
          {
            question: "박싱/언박싱이 정확히 왜 비용인가요?",
            modelAnswer: [
              "박싱은 값 타입을 힙의 object로 감싸는 새 객체 할당이고, 언박싱은 다시 값 타입으로 꺼내는 변환입니다.",
              "반복 루프나 대량 컬렉션에서 힙 할당과 GC 압박이 누적되어 성능 문제가 됩니다.",
            ],
          },
          {
            question: "ArrayList와 List<object>는 같은가요?",
            modelAnswer: [
              "둘 다 object를 담을 수 있다는 점은 비슷하지만 List<object>는 제네릭 컬렉션 API와 타입 인자가 명시된 구조입니다.",
              "다만 List<object>도 값 타입을 넣으면 object로 박싱되므로 List<int> 같은 구체 타입 컬렉션과 성능 특성이 다릅니다.",
            ],
          },
          {
            question: "ArrayList는 내부 구조가 LinkedList처럼 노드 기반인가요?",
            modelAnswer: [
              "아닙니다. ArrayList도 List<T>처럼 내부 배열 기반 동적 배열입니다.",
              "차이의 핵심은 배열 기반 여부가 아니라 비제네릭 object 저장과 제네릭 타입 안정성입니다.",
            ],
          },
          {
            question: "면접에서 ArrayList를 써도 되는 상황을 물으면 어떻게 답하나요?",
            modelAnswer: [
              "레거시 .NET API와 호환해야 하거나 타입이 정말 object로 통일된 오래된 코드에서는 만날 수 있습니다.",
              "하지만 새 코드라면 List<T>, Collection<T>, IReadOnlyList<T> 등 제네릭 컬렉션을 우선 선택한다고 답하는 것이 안전합니다.",
            ],
          },
        ],
      },
      {
        id: "hashmap-collision",
        question: "Dictionary/HashMap의 평균 O(1)이 깨지는 경우와 충돌 처리 방식을 설명해보세요.",
        oneLiner: "해시 충돌과 리사이즈 비용을 이해해야 한다.",
        difficulty: "중급",
        keywords: ["Dictionary", "HashMap", "해시 충돌", "Equals", "GetHashCode"],
        modelAnswer: [
          "해시맵은 키의 해시값으로 버킷 위치를 찾기 때문에 평균 조회/삽입/삭제가 O(1)입니다.",
          "충돌이 많으면 같은 버킷에 원소가 몰려 최악 O(n)까지 나빠질 수 있습니다.",
          "GetHashCode와 Equals가 일관되지 않으면 조회 실패나 중복 키 문제가 생깁니다.",
          "대량 삽입이 예상되면 초기 capacity를 지정해 리사이즈 비용을 줄이는 것이 좋습니다.",
        ],
        followUps: [
          {
            question: "mutable 객체를 Dictionary key로 쓰면 어떤 문제가 생기나요?",
            modelAnswer: [
              "삽입 후 key의 해시 관련 필드가 바뀌면 기존 버킷에서 찾을 수 없어 조회/삭제가 실패할 수 있습니다.",
              "key는 불변 값이나 안정적인 식별자를 쓰는 것이 안전합니다.",
            ],
          },
        ],
      },
      {
        id: "heap-priorityqueue",
        question: "Heap과 PriorityQueue의 내부 원리와 사용 사례를 설명해보세요.",
        oneLiner: "최솟값/최댓값을 빠르게 꺼내는 완전 이진 트리 기반 구조다.",
        difficulty: "중급",
        keywords: ["Heap", "PriorityQueue", "Dijkstra", "Greedy"],
        modelAnswer: [
          "힙은 부모가 자식보다 작거나 큰 성질을 유지하는 완전 이진 트리입니다.",
          "루트 조회는 O(1), 삽입과 삭제는 heapify 과정 때문에 O(log n)입니다.",
          "PriorityQueue는 보통 힙으로 구현되며 다익스트라, 작업 스케줄링, 그리디 문제에 자주 쓰입니다.",
          "C# PriorityQueue<TElement, TPriority>는 priority가 작은 항목이 먼저 나옵니다.",
        ],
        followUps: [
          {
            question: "정렬 배열로 우선순위 큐를 만들면 안 되나요?",
            modelAnswer: [
              "가능하지만 삽입/삭제 중 하나가 O(n)이 되기 쉽습니다.",
              "동적으로 계속 넣고 빼는 문제에서는 힙이 균형 잡힌 선택입니다.",
            ],
          },
        ],
      },
      {
        id: "tree-traversal-bst",
        question: "BST와 트리 순회 방식의 면접 핵심을 설명해보세요.",
        oneLiner: "BST는 중위 순회 결과가 정렬된다는 성질이 핵심이다.",
        difficulty: "기초",
        keywords: ["Tree", "BST", "Inorder", "AVL", "Red-Black Tree"],
        modelAnswer: [
          "BST는 왼쪽 서브트리 < 루트 < 오른쪽 서브트리 조건을 만족하는 이진 트리입니다.",
          "중위 순회하면 오름차순 결과가 나오므로 BST 검증/정렬 문제에 활용됩니다.",
          "편향되면 탐색이 O(n)이 되므로 AVL/Red-Black Tree 같은 균형 트리가 O(log n)을 보장합니다.",
          "C# SortedSet/SortedDictionary는 정렬 유지가 필요할 때 HashSet/Dictionary 대신 고려합니다.",
        ],
        followUps: [
          {
            question: "HashSet과 SortedSet은 언제 다르게 선택하나요?",
            modelAnswer: [
              "단순 포함 여부가 중요하면 HashSet이 평균 O(1)이라 유리합니다.",
              "정렬 순회, Min/Max, 범위 질의가 필요하면 SortedSet이 적합합니다.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "oop-design-general",
    title: "OOP / 설계 판단",
    color: "yellow",
    items: [
      {
        id: "oop-explain",
        question: "객체지향 프로그래밍에 대해 설명해주세요.",
        oneLiner: "객체의 상태와 행동을 묶고 책임 단위로 시스템을 나누는 프로그래밍 방식이다.",
        difficulty: "기초",
        keywords: ["OOP", "객체지향", "캡슐화", "상속", "다형성", "추상화"],
        modelAnswer: [
          "객체지향 프로그래밍은 현실이나 도메인의 개념을 객체로 모델링하고, 객체들이 협력하면서 문제를 해결하는 방식입니다.",
          "객체는 상태를 나타내는 데이터와 그 상태를 다루는 행동을 함께 가집니다.",
          "핵심 특성은 캡슐화, 추상화, 상속, 다형성입니다.",
          "캡슐화는 내부 상태를 숨기고 공개 API로만 조작하게 해 객체의 불변식을 보호합니다.",
          "추상화와 다형성은 구현체를 교체 가능하게 만들어 조건 분기를 줄이고 확장성을 높입니다.",
          "다만 OOP는 클래스를 많이 만드는 것이 목적이 아니라, 책임을 적절히 나누고 변경 영향을 줄이는 설계 방식이라고 설명할 수 있습니다.",
        ],
        followUps: [
          {
            question: "객체지향의 4대 특성을 각각 설명해보세요.",
            modelAnswer: [
              "캡슐화는 데이터와 행동을 묶고 외부 접근을 제한하는 것입니다.",
              "추상화는 중요한 계약만 드러내고 세부 구현을 숨기는 것입니다.",
              "상속은 기존 타입의 속성과 행동을 물려받아 확장하는 것입니다.",
              "다형성은 같은 인터페이스나 부모 타입으로 여러 구현을 동일하게 다루는 것입니다.",
            ],
          },
          {
            question: "다형성은 C#에서 어떻게 구현하나요?",
            modelAnswer: [
              "대표적으로 interface, abstract class, virtual/override를 사용합니다.",
              "예를 들어 IAttackPolicy 인터페이스를 두고 MeleeAttack, RangeAttack 구현체를 교체하면 호출부는 구체 타입을 몰라도 됩니다.",
            ],
          },
          {
            question: "상속의 단점은 무엇인가요?",
            modelAnswer: [
              "부모 구현과 계약에 강하게 묶여 변경 영향이 아래 타입으로 전파됩니다.",
              "상속 계층이 깊어지면 실제 동작을 추적하기 어렵고, 잘못된 is-a 관계는 LSP 위반으로 이어질 수 있습니다.",
            ],
          },
          {
            question: "컴포지션이 상속보다 낫다는 말은 무슨 뜻인가요?",
            modelAnswer: [
              "변하는 행동을 부모 클래스에 고정하지 않고 별도 객체로 조합하면 런타임 교체와 테스트가 쉬워집니다.",
              "상속은 안정적인 is-a 관계에 쓰고, 정책/행동 변경은 컴포지션으로 분리하는 판단이 중요합니다.",
            ],
          },
          {
            question: "객체지향과 SOLID는 어떤 관계인가요?",
            modelAnswer: [
              "SOLID는 객체지향 코드를 변경에 강하게 만들기 위한 설계 원칙입니다.",
              "예를 들어 SRP는 책임 분리를, OCP/DIP는 추상화와 다형성을 이용한 확장을 강조합니다.",
            ],
          },
          {
            question: "게임 클라이언트에서 객체지향을 적용한 예시를 들어보세요.",
            modelAnswer: [
              "캐릭터를 Player, Monster로 단순 상속하기보다 이동/공격/상태 효과를 각각 IMovement, IAttackPolicy, IStatusEffect 같은 책임으로 분리할 수 있습니다.",
              "이렇게 하면 신규 공격 방식이나 상태 효과를 추가할 때 기존 캐릭터 코드를 덜 수정하게 됩니다.",
            ],
          },
          {
            question: "객체지향의 단점이나 한계는 무엇인가요?",
            modelAnswer: [
              "객체가 힙에 흩어지면 캐시 효율이 떨어질 수 있고, 과한 추상화는 구조를 복잡하게 만듭니다.",
              "대량 데이터 처리나 성능 hot path에서는 DOD/ECS 같은 데이터 중심 설계가 더 적합할 수 있습니다.",
            ],
          },
        ],
      },
      {
        id: "inheritance-composition",
        question: "상속보다 컴포지션을 선호하라는 말의 의미를 설명해보세요.",
        oneLiner: "상속은 is-a 관계가 명확할 때, 변화하는 행동은 컴포지션으로 분리한다.",
        difficulty: "중급",
        keywords: ["상속", "컴포지션", "다형성", "결합도"],
        modelAnswer: [
          "상속은 부모의 구현과 계약을 함께 물려받기 때문에 결합도가 높아집니다.",
          "컴포지션은 필요한 기능을 객체로 주입하거나 조합하므로 런타임 교체와 테스트가 쉽습니다.",
          "is-a 관계가 안정적이면 상속이 적합하지만, 행동이 자주 바뀌면 전략/컴포넌트 조합이 유리합니다.",
          "게임에서는 캐릭터 능력, 이동 방식, 공격 정책처럼 조합 가능한 행동을 컴포지션으로 두는 경우가 많습니다.",
        ],
        followUps: [
          {
            question: "그럼 상속은 언제 쓰는 게 좋나요?",
            modelAnswer: [
              "공통 기반 계약이 안정적이고 하위 타입이 부모를 자연스럽게 대체할 수 있을 때 사용합니다.",
              "추상 클래스의 공통 초기화/템플릿 메서드가 실제 중복을 줄일 때도 타당합니다.",
            ],
          },
        ],
      },
      {
        id: "interface-abstract-class",
        question: "인터페이스와 추상 클래스의 차이를 실무 기준으로 설명해보세요.",
        oneLiner: "인터페이스는 계약, 추상 클래스는 공통 상태와 구현 공유에 가깝다.",
        difficulty: "기초",
        keywords: ["interface", "abstract class", "계약", "공통 구현"],
        modelAnswer: [
          "인터페이스는 구현체가 제공해야 하는 기능 계약을 표현하며 다중 구현이 가능합니다.",
          "추상 클래스는 상태, 생성자, 공통 구현을 공유할 수 있지만 단일 상속만 가능합니다.",
          "외부 교체 가능성과 테스트 대역이 중요하면 인터페이스가 유리합니다.",
          "공통 초기화와 부분 구현이 핵심이면 추상 클래스가 더 자연스럽습니다.",
        ],
        followUps: [
          {
            question: "C# 8 이후 인터페이스 기본 구현이 있는데 추상 클래스가 필요 없나요?",
            modelAnswer: [
              "아닙니다. 인터페이스 기본 구현은 버전 호환성 보완에 가깝고, 상태/생성자 공유는 여전히 추상 클래스 영역입니다.",
            ],
          },
        ],
      },
      {
        id: "pattern-choice",
        question: "전략, 상태, 옵저버 패턴을 각각 언제 쓰는지 비교해보세요.",
        oneLiner: "변하는 축이 알고리즘인지, 내부 상태인지, 이벤트 통지인지로 구분한다.",
        difficulty: "중급",
        keywords: ["Strategy", "State", "Observer", "패턴 선택"],
        modelAnswer: [
          "전략 패턴은 알고리즘/정책을 교체하고 싶을 때 씁니다.",
          "상태 패턴은 객체의 내부 상태에 따라 행동이 바뀌고 상태별 로직이 커질 때 씁니다.",
          "옵저버 패턴은 발행자와 구독자를 느슨하게 연결해 이벤트를 전파할 때 씁니다.",
          "패턴 이름보다 중요한 것은 변경 이유를 분리해 코드 수정 범위를 줄이는 것입니다.",
        ],
        followUps: [
          {
            question: "패턴을 과하게 쓰면 어떤 문제가 있나요?",
            modelAnswer: [
              "작은 문제에 과한 추상화를 넣으면 파일 수와 호출 단계가 늘어 디버깅 비용이 커집니다.",
              "변경 가능성이 실제로 높은 지점에만 적용하는 판단이 필요합니다.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "os-concurrency",
    title: "OS / 동시성 / 비동기",
    color: "red",
    items: [
      {
        id: "process-thread-task",
        question: "프로세스와 쓰레드에 대해 설명해주세요.",
        oneLiner: "프로세스는 자원 격리 단위, 쓰레드는 CPU가 실행하는 흐름이다.",
        difficulty: "기초",
        keywords: ["Process", "Thread", "주소 공간", "Context Switching", "동기화"],
        modelAnswer: [
          "프로세스는 실행 중인 프로그램의 인스턴스로, OS로부터 독립된 주소 공간과 자원을 할당받습니다.",
          "각 프로세스는 기본적으로 서로의 메모리에 직접 접근할 수 없어서 안정성과 격리성이 좋습니다.",
          "쓰레드는 프로세스 내부에서 실제 명령을 실행하는 흐름이며, 같은 프로세스의 코드/힙/전역 데이터를 공유합니다.",
          "대신 쓰레드마다 독립적인 스택과 레지스터 상태를 가지고 스케줄러에 의해 CPU 시간을 배정받습니다.",
          "프로세스는 격리가 강하지만 생성과 통신 비용이 크고, 쓰레드는 가볍고 공유가 쉬운 대신 동기화 문제가 생깁니다.",
          "면접에서는 '프로세스는 자원과 격리의 단위, 쓰레드는 실행과 스케줄링의 단위'라고 정리하면 좋습니다.",
        ],
        followUps: [
          {
            question: "프로세스끼리는 메모리를 공유하지 못하는데 어떻게 통신하나요?",
            modelAnswer: [
              "파이프, 소켓, 메시지 큐, 파일, 공유 메모리 같은 IPC를 사용합니다.",
              "공유 메모리는 빠르지만 별도 동기화가 필요하고, 소켓/파이프는 격리가 명확하지만 상대적으로 비용이 큽니다.",
            ],
          },
          {
            question: "쓰레드가 메모리를 공유하면 어떤 문제가 생기나요?",
            modelAnswer: [
              "여러 쓰레드가 같은 데이터를 동시에 읽고 쓰면 race condition이 생길 수 있습니다.",
              "이를 막기 위해 lock, Monitor, Mutex, Semaphore, Interlocked 같은 동기화 도구를 사용합니다.",
              "동기화가 잘못되면 deadlock, starvation, priority inversion 같은 문제가 이어질 수 있습니다.",
            ],
          },
          {
            question: "프로세스 컨텍스트 스위칭과 쓰레드 컨텍스트 스위칭은 뭐가 다른가요?",
            modelAnswer: [
              "둘 다 CPU가 실행 대상을 바꾸며 레지스터/스택 포인터 등 실행 문맥을 저장하고 복원하는 작업입니다.",
              "프로세스 전환은 주소 공간 변경과 TLB/cache 영향이 더 커서 일반적으로 쓰레드 전환보다 비용이 큽니다.",
              "다만 쓰레드 전환도 공짜는 아니므로 과도한 쓰레드 생성은 성능을 떨어뜨립니다.",
            ],
          },
          {
            question: "쓰레드는 각자 무엇을 독립적으로 가지고, 무엇을 공유하나요?",
            modelAnswer: [
              "각 쓰레드는 스택, 레지스터 상태, 스레드 로컬 저장소 등을 독립적으로 가집니다.",
              "같은 프로세스의 힙, 코드 영역, 전역/정적 데이터, 파일 핸들 같은 자원은 공유합니다.",
              "그래서 지역 변수는 대체로 각 스택에 있지만, 참조하는 객체가 힙에 있으면 여러 쓰레드가 함께 볼 수 있습니다.",
            ],
          },
          {
            question: "C#에서 Thread와 Task는 어떻게 다른가요?",
            modelAnswer: [
              "Thread는 OS 스레드를 직접 만들고 제어하는 저수준 API에 가깝습니다.",
              "Task는 '수행할 작업'을 표현하는 고수준 추상화이며 보통 ThreadPool의 워커 스레드에서 실행됩니다.",
              "대부분의 일반 비동기/병렬 작업은 Thread를 직접 만들기보다 Task, async/await, ThreadPool을 우선 고려합니다.",
            ],
          },
          {
            question: "async/await가 새 쓰레드를 만드는 건가요?",
            modelAnswer: [
              "아닙니다. await는 비동기 작업이 끝난 뒤 이어서 실행할 continuation을 등록하는 문법입니다.",
              "I/O 대기 중에는 쓰레드를 붙잡지 않고 반환할 수 있으며, CPU 병렬 처리가 필요하면 Task.Run 같은 별도 실행이 필요합니다.",
            ],
          },
          {
            question: "멀티프로세스와 멀티쓰레드 중 어떤 구조가 더 안전한가요?",
            modelAnswer: [
              "안정성과 장애 격리는 멀티프로세스가 유리합니다. 한 프로세스가 죽어도 다른 프로세스 메모리를 직접 망가뜨리기 어렵습니다.",
              "성능과 데이터 공유 비용은 멀티쓰레드가 유리할 수 있지만 동기화와 디버깅 난도가 올라갑니다.",
              "결국 격리, 통신 비용, 장애 전파, 구현 복잡도를 기준으로 선택합니다.",
            ],
          },
        ],
      },
      {
        id: "hardware-cache",
        question: "컴퓨터 부품 중 캐시는 무엇인가요?",
        oneLiner: "CPU와 RAM 사이 속도 차이를 줄이기 위한 작고 빠른 임시 저장소다.",
        difficulty: "기초",
        keywords: ["Cache", "CPU Cache", "L1", "L2", "L3", "Locality", "Cache Line"],
        modelAnswer: [
          "캐시는 CPU가 자주 사용할 가능성이 높은 데이터나 명령어를 가까운 고속 메모리에 임시로 저장하는 장치입니다.",
          "CPU는 RAM보다 훨씬 빠르기 때문에 RAM에 매번 직접 접근하면 대기 시간이 커집니다.",
          "그래서 L1, L2, L3 같은 캐시 계층을 두고, CPU는 먼저 가까운 캐시에서 데이터를 찾습니다.",
          "캐시는 시간적 지역성(방금 쓴 데이터는 또 쓸 가능성이 높음)과 공간적 지역성(근처 주소도 곧 쓸 가능성이 높음)을 이용합니다.",
          "캐시에 있으면 cache hit, 없어서 RAM까지 가야 하면 cache miss이며, miss가 많을수록 성능이 떨어집니다.",
        ],
        followUps: [
          {
            question: "L1, L2, L3 캐시는 어떻게 다르나요?",
            modelAnswer: [
              "보통 L1이 가장 작고 가장 빠르며 코어에 가장 가깝습니다.",
              "L2는 L1보다 크지만 조금 느리고, L3는 더 크고 여러 코어가 공유하는 경우가 많습니다.",
              "계층이 내려갈수록 용량은 커지고 접근 속도는 느려지는 구조입니다.",
            ],
          },
          {
            question: "캐시 라인(Cache Line)이 무엇인가요?",
            modelAnswer: [
              "캐시는 바이트 하나씩이 아니라 보통 64B 정도의 블록 단위로 데이터를 가져옵니다.",
              "이 블록을 캐시 라인이라고 하며, 배열을 순차 접근할 때 주변 데이터까지 함께 들어와 성능이 좋아집니다.",
            ],
          },
          {
            question: "배열 순회가 LinkedList 순회보다 빠른 이유를 캐시 관점에서 설명해보세요.",
            modelAnswer: [
              "배열은 메모리에 연속적으로 배치되어 한 캐시 라인에 여러 원소가 같이 들어옵니다.",
              "LinkedList는 노드가 힙 곳곳에 흩어질 수 있어 다음 노드를 따라갈 때 캐시 미스가 자주 발생합니다.",
            ],
          },
          {
            question: "캐시 미스 종류에는 무엇이 있나요?",
            modelAnswer: [
              "Cold miss는 처음 접근해서 아직 캐시에 없는 경우입니다.",
              "Capacity miss는 캐시 용량이 부족해 필요한 데이터가 밀려난 경우입니다.",
              "Conflict miss는 캐시 매핑 충돌 때문에 다른 데이터가 같은 위치를 차지해 발생하는 경우입니다.",
            ],
          },
          {
            question: "캐시와 레지스터, RAM은 어떻게 다른가요?",
            modelAnswer: [
              "레지스터는 CPU 내부의 가장 빠르고 아주 작은 저장 공간입니다.",
              "캐시는 레지스터보다 크고 느리지만 RAM보다 훨씬 빠른 중간 계층입니다.",
              "RAM은 용량이 크지만 CPU 입장에서는 상대적으로 느린 주기억장치입니다.",
            ],
          },
          {
            question: "멀티스레딩에서 캐시 때문에 생기는 문제는 무엇이 있나요?",
            modelAnswer: [
              "대표적으로 false sharing이 있습니다. 서로 다른 변수를 수정해도 같은 캐시 라인에 있으면 코어 간 캐시 무효화가 반복됩니다.",
              "정합성 문제는 아니지만 성능이 크게 떨어질 수 있어 패딩, 데이터 분리, 스레드 로컬 누적 같은 방식으로 완화합니다.",
            ],
          },
          {
            question: "게임 클라이언트에서 캐시를 고려한 설계 예시는 무엇인가요?",
            modelAnswer: [
              "대량 오브젝트 업데이트에서 class 객체들을 흩뿌리는 대신 struct 배열이나 NativeArray처럼 연속 메모리 구조를 쓰는 방식입니다.",
              "ECS/DOD가 성능에 유리한 이유도 같은 종류의 데이터를 청크에 모아 캐시 적중률을 높이기 때문입니다.",
            ],
          },
        ],
      },
      {
        id: "lock-mutex-semaphore",
        question: "lock, Mutex, Semaphore의 차이를 설명해보세요.",
        oneLiner: "배타 접근, 프로세스 간 동기화, 동시 진입 수 제한으로 구분한다.",
        difficulty: "중급",
        keywords: ["lock", "Monitor", "Mutex", "Semaphore", "SemaphoreSlim"],
        modelAnswer: [
          "lock은 Monitor 기반으로 같은 프로세스 내부 임계구역 보호에 가장 흔히 씁니다.",
          "Mutex는 OS 커널 객체라 프로세스 간 동기화가 가능하지만 상대적으로 무겁습니다.",
          "Semaphore는 동시에 N개까지 진입을 허용해 커넥션 풀이나 작업 슬롯 제한에 적합합니다.",
          "async 코드에서는 SemaphoreSlim.WaitAsync처럼 비동기 친화 도구를 선택해야 합니다.",
        ],
        followUps: [
          {
            question: "lock 안에서 await를 쓰면 왜 문제가 되나요?",
            modelAnswer: [
              "C# lock 문은 await를 허용하지 않고, 락을 잡은 채 비동기 대기를 하면 교착/스루풋 저하 위험이 큽니다.",
              "비동기 임계구역은 SemaphoreSlim 같은 도구로 설계합니다.",
            ],
          },
        ],
      },
      {
        id: "deadlock-racecondition",
        question: "Race Condition과 Deadlock의 차이, 예방 방법을 설명해보세요.",
        oneLiner: "Race는 순서 의존 버그, Deadlock은 서로 기다리는 정지 상태다.",
        difficulty: "중급",
        keywords: ["Race Condition", "Deadlock", "lock ordering", "critical section"],
        modelAnswer: [
          "Race Condition은 공유 상태 접근 순서에 따라 결과가 달라지는 문제입니다.",
          "Deadlock은 서로가 가진 자원을 기다리며 진행이 멈추는 문제입니다.",
          "Race는 임계구역 보호, 불변 데이터, 메시지 큐, 원자 연산으로 완화합니다.",
          "Deadlock은 락 획득 순서 통일, 타임아웃, 락 범위 최소화로 예방합니다.",
        ],
        followUps: [
          {
            question: "volatile만 붙이면 thread-safe한가요?",
            modelAnswer: [
              "아닙니다. volatile은 가시성 보장에 가깝고 복합 연산의 원자성은 보장하지 않습니다.",
              "카운터 증가는 Interlocked, 여러 필드 불변식은 lock이 필요합니다.",
            ],
          },
        ],
      },
      {
        id: "false-sharing",
        question: "False Sharing이 무엇이고 왜 게임/서버 성능에서 문제가 되나요?",
        oneLiner: "다른 변수라도 같은 캐시 라인에 있으면 코어 간 invalidation이 발생한다.",
        difficulty: "심화",
        keywords: ["False Sharing", "CPU Cache", "Cache Line", "멀티스레딩"],
        modelAnswer: [
          "CPU는 보통 캐시 라인 단위로 메모리 일관성을 관리합니다.",
          "여러 스레드가 서로 다른 필드를 수정해도 같은 캐시 라인에 있으면 캐시 무효화가 반복됩니다.",
          "정합성 버그는 아니지만 코어 수가 늘수록 성능이 떨어지는 현상이 생길 수 있습니다.",
          "패딩, 스레드별 로컬 누적 후 병합, 데이터 분리로 완화합니다.",
        ],
        followUps: [
          {
            question: "프로파일링 없이 코드만 보고 알 수 있나요?",
            modelAnswer: [
              "추정은 가능하지만 확정은 어렵습니다. Release 빌드와 충분한 반복, CPU 카운터 기반 측정이 필요합니다.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "network-database",
    title: "네트워크 / 데이터베이스 / 캐시",
    color: "white",
    items: [
      {
        id: "tcp-udp-game",
        question: "TCP와 UDP를 게임 클라이언트 관점에서 어떻게 선택하나요?",
        oneLiner: "신뢰성/순서 보장 필요성과 지연 민감도를 기준으로 나눈다.",
        difficulty: "기초",
        keywords: ["TCP", "UDP", "실시간 게임", "패킷 손실", "지연"],
        modelAnswer: [
          "TCP는 순서와 전달을 보장하지만 Head-of-Line Blocking 때문에 실시간 입력에는 불리할 수 있습니다.",
          "UDP는 손실 가능성이 있지만 지연이 낮아 위치/입력 같은 실시간 데이터에 적합합니다.",
          "로그인, 결제, 패치 같은 신뢰성 중심 요청은 TCP/HTTPS가 자연스럽습니다.",
          "UDP를 쓰더라도 중요한 이벤트는 앱 레벨 ACK, 시퀀스 번호, 재전송 정책을 설계합니다.",
        ],
        followUps: [
          {
            question: "UDP면 패킷 순서가 보장되지 않는데 어떻게 처리하나요?",
            modelAnswer: [
              "시퀀스 번호와 서버 tick을 넣어 오래된 패킷을 버리고, 필요한 데이터만 선택적으로 재전송합니다.",
            ],
          },
        ],
      },
      {
        id: "http-rest-status",
        question: "REST API 설계에서 HTTP 메서드와 상태 코드를 어떻게 사용하나요?",
        oneLiner: "자원 URI와 메서드 의미, 멱등성, 상태 코드를 일관되게 써야 한다.",
        difficulty: "기초",
        keywords: ["REST", "HTTP", "멱등성", "Status Code"],
        modelAnswer: [
          "GET은 조회, POST는 생성/명령, PUT은 전체 교체, PATCH는 부분 수정, DELETE는 삭제에 사용합니다.",
          "GET/PUT/DELETE는 일반적으로 멱등성을 기대하고 POST는 그렇지 않을 수 있습니다.",
          "2xx는 성공, 4xx는 클라이언트 오류, 5xx는 서버 오류로 구분합니다.",
          "클라이언트 구현에서는 재시도 가능 여부를 멱등성과 상태 코드 기준으로 판단해야 합니다.",
        ],
        followUps: [
          {
            question: "POST도 재시도해야 하는 상황이면 어떻게 하나요?",
            modelAnswer: [
              "Idempotency-Key를 도입해 같은 요청이 중복 처리되지 않도록 서버가 요청 식별자를 저장합니다.",
            ],
          },
        ],
      },
      {
        id: "db-index-transaction",
        question: "DB 인덱스와 트랜잭션 격리 수준을 설명해보세요.",
        oneLiner: "인덱스는 조회를 빠르게 하지만 쓰기 비용을 늘리고, 격리 수준은 일관성과 동시성의 균형이다.",
        difficulty: "중급",
        keywords: ["Index", "Transaction", "Isolation", "ACID", "Lock"],
        modelAnswer: [
          "인덱스는 B-Tree 등으로 검색 범위를 줄여 조회를 빠르게 하지만 삽입/수정/삭제 시 유지 비용이 듭니다.",
          "트랜잭션은 ACID를 통해 작업의 원자성과 일관성을 보장합니다.",
          "격리 수준이 높을수록 dirty/non-repeatable/phantom read를 줄이지만 동시성이 낮아질 수 있습니다.",
          "실무에서는 쿼리 패턴과 쓰기 빈도를 보고 필요한 컬럼에만 인덱스를 설계합니다.",
        ],
        followUps: [
          {
            question: "인덱스를 많이 만들면 무조건 좋은가요?",
            modelAnswer: [
              "아닙니다. 저장공간과 쓰기 비용이 늘고 옵티마이저 선택이 복잡해질 수 있습니다.",
              "실제 실행 계획과 쿼리 빈도를 기준으로 검증해야 합니다.",
            ],
          },
        ],
      },
      {
        id: "cache-aside-consistency",
        question: "Cache-Aside 패턴의 흐름과 일관성 문제를 설명해보세요.",
        oneLiner: "캐시 미스 시 DB 조회 후 채우고, 쓰기 후 무효화로 일관성을 관리한다.",
        difficulty: "중급",
        keywords: ["Cache-Aside", "Redis", "TTL", "Cache Stampede", "Consistency"],
        modelAnswer: [
          "읽기는 캐시 조회 후 미스면 DB에서 읽고 캐시에 저장합니다.",
          "쓰기는 DB를 먼저 갱신하고 관련 캐시를 삭제하거나 갱신합니다.",
          "TTL, 분산락, single-flight로 캐시 스탬피드와 오래된 데이터 문제를 완화합니다.",
          "강한 일관성이 필요한 데이터에는 캐시 적용 범위와 무효화 정책을 보수적으로 잡아야 합니다.",
        ],
        followUps: [
          {
            question: "캐시 삭제와 DB 업데이트 순서는 어떻게 잡나요?",
            modelAnswer: [
              "일반적으로 DB를 성공적으로 갱신한 뒤 캐시를 삭제합니다.",
              "동시성까지 엄격히 보면 double delete, 버전 필드, 이벤트 기반 무효화 등을 고려합니다.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "unity-gameplay-assets",
    title: "Unity 게임플레이 / 에셋 / 엔진",
    color: "red",
    items: [
      {
        id: "unity-engine-runtime",
        question: "유니티 동작 원리에 대해 설명해주세요.",
        oneLiner: "Scene의 GameObject/Component들을 PlayerLoop가 프레임 단위로 갱신하고, 물리·스크립트·렌더링·GC가 그 안에서 순서대로 맞물린다.",
        difficulty: "중급",
        keywords: ["Unity", "PlayerLoop", "GameObject", "Component", "MonoBehaviour", "Rendering", "Physics"],
        modelAnswer: [
          "Unity는 Scene 안의 GameObject에 Component를 붙이는 컴포넌트 기반 엔진입니다. Transform, Renderer, Collider, MonoBehaviour 같은 컴포넌트가 조합되어 객체의 상태와 동작을 만듭니다.",
          "런타임에서는 엔진의 PlayerLoop가 매 프레임 입력 처리, 스크립트 라이프사이클 호출, 애니메이션, 물리, 렌더링 준비, 렌더 명령 제출 같은 단계를 순서대로 실행합니다.",
          "스크립트 관점에서는 Awake/OnEnable/Start로 초기화하고, Update에서 프레임 기반 로직, FixedUpdate에서 물리 타임스텝 로직, LateUpdate에서 카메라 추적 같은 후처리를 수행합니다.",
          "물리는 고정 시간 간격으로 시뮬레이션되고, 렌더링은 카메라 기준 컬링, 정렬, 배칭, 셰이더/머티리얼 상태 설정 후 GPU에 draw call을 제출하는 방식으로 진행됩니다.",
          "대부분의 Unity API는 메인 스레드에서 사용해야 하므로, 무거운 계산은 Job System/Burst/비동기 로딩으로 분리하되 결과를 메인 스레드 적용 단계와 안전하게 연결해야 합니다.",
          "C# 스크립트는 Mono 또는 IL2CPP 런타임 위에서 실행되고, 관리 힙 할당은 GC 대상이므로 프레임 루프에서 불필요한 문자열 생성, LINQ, boxing, Instantiate/Destroy 반복을 줄이는 것이 중요합니다.",
          "면접에서는 Unity를 단순한 Update 호출 모음이 아니라 에셋 로딩, 씬 객체 그래프, 컴포넌트 조합, PlayerLoop, 물리/렌더링 파이프라인이 연결된 런타임으로 설명하면 좋습니다.",
        ],
        followUps: [
          {
            question: "PlayerLoop를 왜 알아야 하나요?",
            modelAnswer: [
              "PlayerLoop는 Unity가 한 프레임을 처리하는 큰 실행 순서입니다.",
              "입력 샘플링, Update, FixedUpdate, LateUpdate, 렌더링 준비가 어떤 순서로 실행되는지 알아야 초기화 순서 버그, 카메라 떨림, 물리 업데이트 불일치를 설명하고 고칠 수 있습니다.",
              "필요하면 PlayerLoop API로 커스텀 시스템을 특정 단계에 삽입할 수 있지만, 일반 프로젝트에서는 실행 순서 이해와 책임 분리에 더 자주 쓰입니다.",
            ],
          },
          {
            question: "GameObject-Component 구조의 장단점은 무엇인가요?",
            modelAnswer: [
              "장점은 상속보다 조합으로 기능을 붙일 수 있어 디자이너 친화적이고 재사용성이 높다는 점입니다.",
              "단점은 컴포넌트가 많아질수록 참조 관계와 실행 순서가 숨겨져 추적이 어려워지고, 대량 객체에서는 메모리 분산과 메인 스레드 Update 비용이 커질 수 있다는 점입니다.",
              "그래서 대량 시뮬레이션은 MonoBehaviour 분산 업데이트보다 매니저/배치 처리, ECS, Job System, 데이터 지향 구조를 고려합니다.",
            ],
          },
          {
            question: "Update와 FixedUpdate를 어떻게 구분해서 쓰나요?",
            modelAnswer: [
              "Update는 렌더 프레임마다 호출되므로 입력 샘플링, UI, 일반 게임 로직에 적합합니다.",
              "FixedUpdate는 고정 시간 간격으로 호출되어 Rigidbody 물리 적용처럼 물리 시뮬레이션과 맞아야 하는 로직에 적합합니다.",
              "입력은 Update에서 받고 물리 적용은 FixedUpdate에서 처리하는 식으로 버퍼링하면 입력 누락과 물리 불일치를 줄일 수 있습니다.",
            ],
          },
          {
            question: "Coroutine은 별도 스레드인가요?",
            modelAnswer: [
              "아닙니다. Unity Coroutine은 대부분 메인 스레드에서 PlayerLoop 단계에 맞춰 이어 실행되는 상태 머신입니다.",
              "yield return null, WaitForSeconds 같은 대기 조건으로 실행을 나눌 뿐 CPU 연산을 병렬 처리하지 않습니다.",
              "무거운 계산을 코루틴으로 쪼개면 프레임 분산은 가능하지만, 병렬 처리가 필요하면 Job System, Task, 별도 스레드 설계를 검토해야 합니다.",
            ],
          },
          {
            question: "Unity API를 백그라운드 스레드에서 마음대로 호출하면 왜 위험한가요?",
            modelAnswer: [
              "대부분의 UnityEngine 객체와 씬 객체 접근은 메인 스레드 전제를 가집니다.",
              "백그라운드 스레드에서 Transform, GameObject, Renderer 같은 API를 직접 만지면 스레드 안전성이 보장되지 않아 예외나 비정상 동작이 날 수 있습니다.",
              "백그라운드에서는 순수 데이터 계산이나 파일/네트워크 작업을 하고, 결과 적용은 메인 스레드 큐나 Job 완료 후 단계에서 처리하는 방식이 안전합니다.",
            ],
          },
          {
            question: "렌더링은 스크립트 Update와 어떤 관계로 동작하나요?",
            modelAnswer: [
              "스크립트가 Transform, Animator, Renderer 상태를 갱신하면 그 결과를 바탕으로 카메라 컬링, 렌더 큐 정렬, 배칭, draw call 제출이 이어집니다.",
              "CPU는 렌더 명령을 만들고 GPU는 셰이더 실행, 래스터라이즈, 블렌딩 등을 수행합니다.",
              "프레임 저하는 스크립트 CPU, 렌더 스레드, GPU 중 어디가 병목인지 Profiler/Frame Debugger/RenderDoc으로 분리해야 합니다.",
            ],
          },
          {
            question: "Instantiate/Destroy를 자주 쓰면 왜 문제가 되나요?",
            modelAnswer: [
              "객체 생성/파괴는 메모리 할당, 컴포넌트 초기화, Transform 계층 갱신, GC 압박을 유발할 수 있습니다.",
              "탄환, 이펙트, 데미지 텍스트처럼 자주 생기고 사라지는 객체는 Object Pool로 재사용하는 것이 일반적입니다.",
              "다만 풀링도 생명주기 복잡도와 메모리 상주 비용이 있으므로 hot path 객체 중심으로 적용해야 합니다.",
            ],
          },
        ],
      },
      {
        id: "unity-lifecycle",
        question: "Awake, OnEnable, Start, Update, FixedUpdate, LateUpdate의 차이를 설명해보세요.",
        oneLiner: "초기화, 활성화, 프레임 업데이트, 물리 업데이트, 후처리 타이밍을 구분한다.",
        difficulty: "기초",
        keywords: ["Unity Lifecycle", "Awake", "Start", "Update", "FixedUpdate", "LateUpdate"],
        modelAnswer: [
          "Awake는 객체 생성/로드 시 초기 참조 구성에 적합하고, OnEnable은 활성화될 때마다 호출됩니다.",
          "Start는 첫 Update 전 한 번 호출되어 다른 객체의 Awake 이후 초기화에 유리합니다.",
          "Update는 프레임마다, FixedUpdate는 고정 물리 타임스텝마다 호출됩니다.",
          "LateUpdate는 카메라 추적처럼 다른 Update 이후 처리에 적합합니다.",
        ],
        followUps: [
          {
            question: "입력 처리는 Update와 FixedUpdate 중 어디가 좋나요?",
            modelAnswer: [
              "입력 샘플링은 프레임 기반인 Update에서 받고, 물리 적용은 FixedUpdate에서 처리하는 식으로 분리하는 경우가 많습니다.",
            ],
          },
        ],
      },
      {
        id: "scriptableobject",
        question: "ScriptableObject를 어떤 용도로 쓰고, 주의점은 무엇인가요?",
        oneLiner: "공유 데이터 에셋과 설정 분리에 유용하지만 런타임 상태 저장에는 주의해야 한다.",
        difficulty: "중급",
        keywords: ["ScriptableObject", "Data Asset", "Config", "런타임 상태"],
        modelAnswer: [
          "ScriptableObject는 아이템 정의, 스킬 설정, 밸런스 테이블처럼 재사용 가능한 데이터 에셋에 적합합니다.",
          "프리팹마다 같은 데이터를 복제하지 않고 참조할 수 있어 메모리와 관리 비용을 줄입니다.",
          "런타임에 값을 변경하면 에디터에서 원본 에셋을 건드리는 실수가 생길 수 있어 상태와 정의 데이터를 분리해야 합니다.",
          "빌드/런타임 로딩 정책과 Addressables 사용 여부도 함께 설계합니다.",
        ],
        followUps: [
          {
            question: "ScriptableObject로 이벤트 채널을 만들 때 장단점은?",
            modelAnswer: [
              "씬 간 참조를 줄이고 디자이너 친화적인 이벤트 연결이 가능하지만, 호출 흐름 추적이 어려워질 수 있습니다.",
            ],
          },
        ],
      },
      {
        id: "addressables-assets",
        question: "Addressables/AssetBundle 기반 로딩에서 가장 주의할 점은 무엇인가요?",
        oneLiner: "로드/해제 생명주기와 참조 카운트를 명확히 관리해야 한다.",
        difficulty: "중급",
        keywords: ["Addressables", "AssetBundle", "Async Loading", "Reference Count"],
        modelAnswer: [
          "Addressables는 비동기 로딩과 원격 콘텐츠 업데이트에 유리하지만 참조 카운트 관리가 중요합니다.",
          "로드한 핸들을 추적하지 않으면 해제 누락으로 메모리 점유가 증가합니다.",
          "반대로 아직 사용하는 에셋을 release하면 missing reference나 재로드 비용이 발생할 수 있습니다.",
          "씬 전환, 전투 진입, 컷신 등 단계별 프리로드/해제 정책을 명확히 둡니다.",
        ],
        followUps: [
          {
            question: "로딩 중 프레임 드랍을 줄이려면?",
            modelAnswer: [
              "비동기 로드, 단계적 인스턴스화, 프리로드 구간 분리, 큰 에셋의 메모리 피크 측정을 함께 적용합니다.",
            ],
          },
        ],
      },
      {
        id: "physics-collision",
        question: "Unity 물리에서 Collision과 Trigger 이벤트 차이와 성능 주의점을 설명해보세요.",
        oneLiner: "충돌 반응이 필요한지, 감지만 필요한지에 따라 collider 설정을 나눈다.",
        difficulty: "중급",
        keywords: ["Physics", "Collision", "Trigger", "Rigidbody", "Layer Collision Matrix"],
        modelAnswer: [
          "Collision은 물리 반응이 포함된 충돌이고 Trigger는 겹침 감지 이벤트에 가깝습니다.",
          "Rigidbody 유무, isTrigger 설정, 레이어 충돌 매트릭스에 따라 이벤트 발생 조건이 달라집니다.",
          "불필요한 충돌 쌍은 레이어로 제거하고, 고빈도 충돌 로직에서는 할당과 GetComponent 반복을 줄입니다.",
          "많은 이동체는 물리 엔진에 모두 맡기기보다 broad-phase 필터링이나 단순 거리 체크를 병행할 수 있습니다.",
        ],
        followUps: [
          {
            question: "FixedUpdate에서 Transform을 직접 움직이면 왜 문제가 될 수 있나요?",
            modelAnswer: [
              "Rigidbody 물리와 Transform 직접 변경이 충돌하면 물리 엔진의 보간/충돌 계산과 어긋날 수 있습니다.",
              "물리 객체는 Rigidbody API를 통해 이동시키는 것이 일반적으로 안전합니다.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "testing-debugging",
    title: "테스트 / 디버깅 / 협업",
    color: "white",
    items: [
      {
        id: "unit-integration-e2e",
        question: "Unit, Integration, E2E 테스트의 차이와 게임 클라에서의 적용 방식을 설명해보세요.",
        oneLiner: "검증 범위와 비용이 다르므로 위험도에 맞게 조합한다.",
        difficulty: "기초",
        keywords: ["Unit Test", "Integration Test", "E2E", "PlayMode Test"],
        modelAnswer: [
          "Unit 테스트는 작은 함수/클래스의 규칙을 빠르게 검증합니다.",
          "Integration 테스트는 여러 모듈이 함께 동작할 때의 계약을 확인합니다.",
          "E2E는 실제 사용자 흐름을 검증하지만 느리고 불안정할 수 있어 핵심 시나리오 위주로 둡니다.",
          "Unity에서는 순수 로직은 EditMode 테스트, 씬/MonoBehaviour 흐름은 PlayMode 테스트로 나눌 수 있습니다.",
        ],
        followUps: [
          {
            question: "모든 것을 E2E로 검증하면 안 되나요?",
            modelAnswer: [
              "느리고 실패 원인 추적이 어렵습니다. 빠른 단위 테스트와 소수의 핵심 E2E를 피라미드 형태로 조합하는 것이 좋습니다.",
            ],
          },
        ],
      },
      {
        id: "debug-performance-issue",
        question: "갑자기 특정 장면에서 프레임이 떨어진다면 어떻게 접근하시겠어요?",
        oneLiner: "재현 조건 고정, 계측, 병목 분리, 작은 변경 검증 순서로 접근한다.",
        difficulty: "중급",
        keywords: ["Profiling", "Regression", "Frame Time", "Debugging"],
        modelAnswer: [
          "먼저 디바이스, 빌드 설정, 입력 조건을 고정해 재현 가능한 상태를 만듭니다.",
          "Profiler로 CPU/GPU/GC/Render Thread 중 어느 축이 증가했는지 분리합니다.",
          "최근 변경사항과 에셋/씬 차이를 좁혀 원인을 가설화하고 하나씩 검증합니다.",
          "수정 후 평균 FPS보다 frame time과 스파이크 감소를 기준으로 확인합니다.",
        ],
        followUps: [
          {
            question: "Profiler에서 GC Alloc이 보이면 바로 풀링부터 하나요?",
            modelAnswer: [
              "먼저 할당 위치와 빈도, 프레임 영향도를 확인합니다.",
              "문자열/LINQ/boxing 같은 간단한 제거가 우선이고, 풀링은 생명주기 관리 비용까지 고려해 적용합니다.",
            ],
          },
        ],
      },
      {
        id: "code-review-priority",
        question: "코드 리뷰에서 무엇을 우선적으로 보나요?",
        oneLiner: "동작 정확성, 경계 조건, 유지보수성, 테스트 가능성을 우선 본다.",
        difficulty: "기초",
        keywords: ["Code Review", "Bug Risk", "Maintainability", "Test"],
        modelAnswer: [
          "가장 먼저 요구사항을 제대로 만족하는지와 실패 케이스를 봅니다.",
          "그 다음 경계 조건, 예외 처리, 동시성/메모리/성능 리스크를 확인합니다.",
          "코드 스타일보다 변경 범위와 추후 수정 비용을 줄이는 구조인지가 중요합니다.",
          "리뷰 코멘트는 취향이 아니라 재현 가능한 문제와 개선 근거 중심으로 작성합니다.",
        ],
        followUps: [
          {
            question: "리뷰에서 의견 충돌이 생기면 어떻게 하나요?",
            modelAnswer: [
              "팀 컨벤션, 성능 측정, 유지보수 비용 같은 객관 기준으로 판단하고 필요하면 작은 실험으로 확인합니다.",
            ],
          },
        ],
      },
      {
        id: "ci-cd-game-client",
        question: "게임 클라이언트 프로젝트에서 CI/CD를 어떻게 구성하면 좋을까요?",
        oneLiner: "빌드 재현성, 자동 테스트, 에셋 검증, 배포 채널 분리를 중심으로 잡는다.",
        difficulty: "중급",
        keywords: ["CI", "CD", "Build", "Asset Validation", "Release"],
        modelAnswer: [
          "PR 단계에서는 정적 검사, 단위 테스트, 에셋 규칙 검증을 빠르게 돌립니다.",
          "메인 브랜치에서는 플랫폼별 빌드와 스모크 테스트를 자동화합니다.",
          "Addressables/AssetBundle 카탈로그 검증, 누락 참조, 용량 증가 체크도 파이프라인에 포함할 수 있습니다.",
          "릴리즈 채널(dev/stage/prod)을 분리해 QA와 배포 리스크를 줄입니다.",
        ],
        followUps: [
          {
            question: "빌드 시간이 너무 길면 어떻게 줄이나요?",
            modelAnswer: [
              "캐시, 변경 영향 범위 기반 job 분리, 에셋 임포트 캐시, 병렬 빌드, 야간 전체 빌드 전략을 조합합니다.",
            ],
          },
        ],
      },
    ],
  },
];
