export type AlgoItem = {
  term: string;
  oneliner: string;
  detail: string[];
  complexity?: string;
  csharp?: string;
};

export type AlgoSection = {
  id: string;
  title: string;
  color: "yellow" | "red" | "white";
  items: AlgoItem[];
};

export const algorithmSections: AlgoSection[] = [
  {
    id: "search-and-backtracking",
    title: "탐색 / 백트래킹",
    color: "red",
    items: [
      {
        term: "DFS + 백트래킹 템플릿",
        oneliner: "선택 → 재귀 → 복원(undo) 패턴. 조합/순열/경로 문제의 기본",
        complexity: "시간 O(branch^depth) / 공간 O(depth)",
        detail: [
          "핵심: 상태를 한 단계 선택하고 재귀 호출한 뒤 원상복구하는 구조가 백트래킹의 본질",
          "면접 포인트: DFS와 백트래킹 차이 설명 가능해야 함. DFS는 순회, 백트래킹은 정답 탐색 + 가지치기",
          "코테 팁: 함수 인자로 큰 배열을 복사하지 말고, 하나의 상태 배열을 push/pop으로 재사용",
          "visited/used 배열과 path 리스트는 가장 흔한 상태 표현",
          "가지치기(pruning) 조건은 재귀 초반에 배치해야 효과가 큼",
          "중복 제거: 정렬 후 이전 값과 비교하거나, 레벨별 HashSet으로 동일 선택 차단",
          "시간 초과가 나면 브랜치 수 줄이기(정렬, upper bound 계산, 불가능 조건 조기 리턴)부터 점검",
          "스택 오버플로우 위험이 있는 깊은 탐색은 반복 DFS(Stack)로 전환 고려",
        ],
        csharp:
          "void Backtrack(int depth) {\n    if (depth == targetDepth) {\n        // 정답 처리\n        return;\n    }\n\n    for (int i = 0; i < n; i++) {\n        if (used[i]) continue;\n\n        // 가지치기 예시\n        if (!IsValid(depth, i)) continue;\n\n        used[i] = true;\n        path.Add(nums[i]);\n\n        Backtrack(depth + 1);\n\n        // undo\n        path.RemoveAt(path.Count - 1);\n        used[i] = false;\n    }\n}\n\nbool IsValid(int depth, int i) {\n    // 조건 위반 시 false\n    return true;\n}",
      },
      {
        term: "순열 / 조합 / 부분집합 생성",
        oneliner: "백트래킹 문제의 80%는 상태 정의만 다르고 템플릿은 동일",
        complexity: "순열 O(n!) / 조합 O(nCk) / 부분집합 O(2^n)",
        detail: [
          "순열: 원소 재사용 불가 + 순서 중요. used 배열 필요",
          "조합: 순서 무시. start 인덱스를 전달해 중복 생성 방지",
          "부분집합: 각 원소를 선택/비선택의 2갈래로 분기",
          "중복 원소가 있는 입력은 정렬 후 같은 레벨에서 같은 값 스킵",
          "면접에서 '왜 이 문제는 조합이고 순열이 아닌가'를 설명하면 설계 역량 평가에 유리",
          "출력 개수가 매우 큰 문제는 결과를 전부 저장하지 말고 카운트만 누적",
          "메모리 최적화: path를 매번 Clone하지 말고 도착 시점에만 복사",
          "코테 실수: start+1 / i+1 인덱스 혼동, 종료 조건 depth 오프바이원",
        ],
        csharp:
          "// 조합: n개 중 k개\nvoid Comb(int start, int depth) {\n    if (depth == k) {\n        result.Add(new List<int>(path));\n        return;\n    }\n    for (int i = start; i < nums.Length; i++) {\n        path.Add(nums[i]);\n        Comb(i + 1, depth + 1);\n        path.RemoveAt(path.Count - 1);\n    }\n}\n\n// 부분집합\nvoid Subset(int idx) {\n    if (idx == nums.Length) {\n        result.Add(new List<int>(path));\n        return;\n    }\n    // 선택\n    path.Add(nums[idx]);\n    Subset(idx + 1);\n    path.RemoveAt(path.Count - 1);\n    // 비선택\n    Subset(idx + 1);\n}",
      },
      {
        term: "상태 공간 BFS (최단 단계 탐색)",
        oneliner: "간선 가중치가 동일하면 BFS가 최단 거리 보장",
        complexity: "시간 O(V+E) / 공간 O(V)",
        detail: [
          "격자/문자열 변환/퍼즐 문제는 '상태'를 노드로 보면 그래프 문제로 환원됨",
          "BFS는 레벨 순회이므로 최초 방문 거리가 곧 최단 거리",
          "방문 체크는 dequeue 시점이 아니라 enqueue 시점에 해야 중복 삽입이 안 생김",
          "상태가 2개 이상이면 visited[x,y,key]처럼 다차원으로 관리",
          "면접 포인트: DFS가 아닌 BFS를 선택한 이유(최단 단계 보장) 설명",
          "0/1 가중치가 섞이면 0-1 BFS(Deque) 또는 다익스트라를 사용",
          "메모리 병목 시 비트마스킹으로 상태 압축 가능",
          "코테 실수: 큐에 넣을 때 거리+1 누락, 경계 검사 순서 오류",
        ],
        csharp:
          "int ShortestPath(int[,] grid, int sr, int sc, int tr, int tc) {\n    int R = grid.GetLength(0), C = grid.GetLength(1);\n    int[,] dist = new int[R, C];\n    for (int r = 0; r < R; r++)\n        for (int c = 0; c < C; c++)\n            dist[r, c] = -1;\n\n    int[] dr = { -1, 1, 0, 0 };\n    int[] dc = { 0, 0, -1, 1 };\n\n    var q = new Queue<(int r, int c)>();\n    q.Enqueue((sr, sc));\n    dist[sr, sc] = 0;\n\n    while (q.Count > 0) {\n        var (r, c) = q.Dequeue();\n        if (r == tr && c == tc) return dist[r, c];\n\n        for (int d = 0; d < 4; d++) {\n            int nr = r + dr[d], nc = c + dc[d];\n            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;\n            if (grid[nr, nc] == 1 || dist[nr, nc] != -1) continue;\n\n            dist[nr, nc] = dist[r, c] + 1;\n            q.Enqueue((nr, nc));\n        }\n    }\n    return -1;\n}",
      },
    ],
  },
  {
    id: "search-optimization",
    title: "탐색 최적화 핵심",
    color: "yellow",
    items: [
      {
        term: "이진 탐색 + 파라메트릭 서치",
        oneliner: "정답 범위를 두고 조건의 단조성을 이용해 O(log range)로 수렴",
        complexity: "시간 O(log N) 또는 O(log range × 판정함수)",
        detail: [
          "정렬 배열 탐색뿐 아니라 '가능/불가능 판정' 문제에도 이진 탐색을 적용할 수 있음",
          "파라메트릭 서치 핵심: f(x)가 단조(true/false 한 번만 바뀜)인지 확인",
          "최소 만족값(lower bound)과 최대 만족값(upper bound) 템플릿을 구분",
          "left/right 초기 범위를 과소 설정하면 정답 누락, 과대 설정하면 반복 증가",
          "면접 포인트: 왜 선형 탐색보다 빠른지 + 왜 단조성 조건이 필수인지 설명",
          "정수 범위 오버플로우 방지: mid = left + (right - left) / 2",
          "C# Array.BinarySearch의 음수 반환(~insertPos) 해석 가능해야 실전에서 안전",
          "코테 실수: while(left < right)와 while(left <= right) 템플릿 혼용으로 무한 루프",
        ],
        csharp:
          "// 최소 만족값 찾기 (f(x) == true 인 가장 작은 x)\nint ParamSearch(int left, int right) {\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        if (Feasible(mid)) right = mid;\n        else left = mid + 1;\n    }\n    return left;\n}\n\nbool Feasible(int x) {\n    // 문제별 판정 함수: 단조성 필수\n    return true;\n}",
      },
      {
        term: "투 포인터 / 슬라이딩 윈도우",
        oneliner: "left/right가 각각 최대 n번만 이동하므로 선형 시간 최적화 가능",
        complexity: "시간 O(n) / 공간 O(1)~O(k)",
        detail: [
          "투 포인터: 쌍(pair) 관계 문제(합, 차, 정렬 배열 비교)에 강함",
          "슬라이딩 윈도우: 연속 구간 문제(최대/최소 길이, 빈도 조건)에 강함",
          "고정 윈도우는 add/remove만 하면 되고, 가변 윈도우는 조건 만족까지 축소",
          "문자열 문제는 int[26], int[128], Dictionary<char,int>로 빈도 관리",
          "면접 포인트: 왜 O(n)인지 이동 횟수 총합으로 설명(각 포인터 n번 이하)",
          "정렬이 필요한 투 포인터는 전처리 O(n log n) 포함 총복잡도 고려",
          "단조 덱과 결합하면 '윈도우 최댓값'을 O(n)에 해결 가능",
          "코테 실수: 창을 줄이는 while 조건 누락, 제거 대상 인덱스 계산 오류",
        ],
        csharp:
          "// 합이 target 이상인 최소 길이 부분배열 (양수 배열)\nint MinLen(int[] nums, int target) {\n    int left = 0, sum = 0, ans = int.MaxValue;\n    for (int right = 0; right < nums.Length; right++) {\n        sum += nums[right];\n        while (sum >= target) {\n            ans = Math.Min(ans, right - left + 1);\n            sum -= nums[left++];\n        }\n    }\n    return ans == int.MaxValue ? 0 : ans;\n}",
      },
      {
        term: "누적합 / 차이 배열",
        oneliner: "구간 질의가 많으면 누적합, 구간 업데이트가 많으면 차이 배열",
        complexity: "누적합: 전처리 O(n), 질의 O(1) / 차이배열: 업데이트 O(1)",
        detail: [
          "누적합(prefix): sum[l..r] = prefix[r+1] - prefix[l]",
          "2D 누적합: 사각형 합 질의 O(1)로 가능(영상/격자 문제에 매우 자주 출제)",
          "차이 배열(diff): diff[l]+=v, diff[r+1]-=v 후 누적해 원본 복원",
          "구간 업데이트 Q가 많을 때 O(nQ)를 O(n+Q)로 줄이는 대표 패턴",
          "면접 포인트: 누적합은 query 최적화, diff는 update 최적화라는 대비 설명",
          "해시맵과 결합하면 '부분합 = k' 개수를 O(n)에 계산 가능",
          "자료형 주의: 합이 커지면 int 대신 long 사용",
          "코테 실수: prefix 길이를 n+1로 두지 않아 경계 연산에서 오류 발생",
        ],
        csharp:
          "// 구간 업데이트 + 최종 배열 복원\nint[] RangeAdd(int n, (int l, int r, int v)[] ops) {\n    int[] diff = new int[n + 1];\n    foreach (var (l, r, v) in ops) {\n        diff[l] += v;\n        if (r + 1 < n) diff[r + 1] -= v;\n    }\n\n    int[] arr = new int[n];\n    int cur = 0;\n    for (int i = 0; i < n; i++) {\n        cur += diff[i];\n        arr[i] = cur;\n    }\n    return arr;\n}",
      },
    ],
  },
  {
    id: "graph-path",
    title: "그래프 / 최단 경로",
    color: "red",
    items: [
      {
        term: "다익스트라 (Dijkstra)",
        oneliner: "음수 간선이 없을 때 단일 시작점 최단거리 표준",
        complexity: "시간 O((V+E) log V) / 공간 O(V+E)",
        detail: [
          "PriorityQueue를 이용해 현재까지 최단 거리가 가장 작은 정점을 먼저 확정",
          "Relaxation: dist[v] > dist[u] + w 이면 갱신",
          "꺼낸 거리(curDist)가 dist[u]와 다르면 stale entry로 스킵",
          "음수 간선이 있으면 결과가 보장되지 않음(벨만-포드 사용 필요)",
          "면접 포인트: BFS와 차이(가중치 1이면 BFS, 일반 비음수 가중치는 다익스트라)",
          "인접 리스트 사용 시 메모리 효율이 좋고 희소 그래프에 유리",
          "long dist 사용으로 오버플로우 방지",
          "코테 실수: 방문 처리 시점을 잘못 잡아 갱신 기회를 놓침",
        ],
        csharp:
          "long[] Dijkstra(List<(int to, int w)>[] g, int start) {\n    int n = g.Length;\n    long INF = long.MaxValue / 4;\n    long[] dist = Enumerable.Repeat(INF, n).ToArray();\n    dist[start] = 0;\n\n    var pq = new PriorityQueue<int, long>();\n    pq.Enqueue(start, 0);\n\n    while (pq.Count > 0) {\n        pq.TryDequeue(out int u, out long d);\n        if (d != dist[u]) continue;\n\n        foreach (var (v, w) in g[u]) {\n            long nd = d + w;\n            if (nd < dist[v]) {\n                dist[v] = nd;\n                pq.Enqueue(v, nd);\n            }\n        }\n    }\n    return dist;\n}",
      },
      {
        term: "벨만-포드 / 음수 사이클 감지",
        oneliner: "음수 간선 허용. V-1번 완화 후 추가 완화 가능하면 음수 사이클",
        complexity: "시간 O(VE) / 공간 O(V)",
        detail: [
          "모든 간선을 반복 완화해 최단거리 수렴",
          "V-1번 반복 후에도 거리 갱신이 가능하면 음수 사이클 존재",
          "다익스트라보다 느리지만 음수 가중치 문제에서 필수",
          "면접 포인트: 왜 V-1번이면 충분한가(단순 경로의 최대 간선 수)",
          "도달 가능한 음수 사이클만 최단경로 문제를 무의미하게 만듦",
          "SPFA는 평균적으로 빠를 수 있으나 최악 O(VE)라 보장 없음",
          "실전에서는 문제 제한이 작거나 음수 간선이 명시될 때 선택",
          "코테 실수: dist[u]가 INF일 때 dist[u]+w 연산으로 오버플로우",
        ],
        csharp:
          "bool BellmanFord(int n, List<(int u, int v, int w)> edges, int start, out long[] dist) {\n    long INF = long.MaxValue / 4;\n    dist = Enumerable.Repeat(INF, n).ToArray();\n    dist[start] = 0;\n\n    for (int i = 0; i < n - 1; i++) {\n        bool updated = false;\n        foreach (var (u, v, w) in edges) {\n            if (dist[u] == INF) continue;\n            long nd = dist[u] + w;\n            if (nd < dist[v]) {\n                dist[v] = nd;\n                updated = true;\n            }\n        }\n        if (!updated) break;\n    }\n\n    foreach (var (u, v, w) in edges) {\n        if (dist[u] == INF) continue;\n        if (dist[u] + w < dist[v]) return false; // 음수 사이클 존재\n    }\n    return true;\n}",
      },
      {
        term: "플로이드-워셜 (All-Pairs Shortest Path)",
        oneliner: "모든 정점 쌍 최단거리. 정점 수가 작을 때 강력",
        complexity: "시간 O(V^3) / 공간 O(V^2)",
        detail: [
          "dist[a,b] = min(dist[a,b], dist[a,k] + dist[k,b])를 k 기준으로 반복",
          "모든 쌍 최단 경로가 필요할 때(질의가 많을 때) 적합",
          "V가 400 이하 수준이면 코테에서 자주 통과 가능",
          "음수 간선 허용(단, 음수 사이클 있으면 최단경로 정의 불가)",
          "면접 포인트: 다익스트라 여러 번과의 비교(희소 그래프 vs 밀집 그래프)",
          "경유지 추적 배열(next)을 두면 실제 경로 복원 가능",
          "INF 처리 시 덧셈 오버플로우 주의",
          "코테 실수: 1-indexed 입력을 0-indexed 배열에 그대로 사용",
        ],
        csharp:
          "long[,] FloydWarshall(long[,] dist) {\n    int n = dist.GetLength(0);\n    long INF = long.MaxValue / 4;\n\n    for (int k = 0; k < n; k++)\n        for (int i = 0; i < n; i++)\n            for (int j = 0; j < n; j++) {\n                if (dist[i, k] == INF || dist[k, j] == INF) continue;\n                long nd = dist[i, k] + dist[k, j];\n                if (nd < dist[i, j]) dist[i, j] = nd;\n            }\n\n    return dist;\n}",
      },
    ],
  },
  {
    id: "dynamic-programming",
    title: "동적 계획법 (DP)",
    color: "yellow",
    items: [
      {
        term: "DP 설계 5단계",
        oneliner: "상태 정의 → 점화식 → 초기값 → 순회 순서 → 정답 위치",
        complexity: "문제별 상이 (보통 상태 수 × 전이 수)",
        detail: [
          "1) 상태 정의: dp[i][j]가 무엇을 의미하는지 한 문장으로 고정",
          "2) 점화식: 이전 상태로부터 현재 상태를 만드는 규칙",
          "3) 초기값: 점화식이 시작되는 베이스 케이스",
          "4) 순회 순서: 의존하는 상태가 먼저 계산되도록 루프 방향 결정",
          "5) 정답 위치: dp[n], dp[n][m], max(dp[*]) 등 반환 지점 명확화",
          "면접 포인트: 점화식 근거를 말로 증명(귀납)하면 강점",
          "메모리 최적화: 이전 행/열만 필요하면 2D→1D 롤링 배열",
          "코테 실수: 초기값/인덱스 범위가 틀려 점화식이 맞아도 오답",
        ],
        csharp:
          "// 예시: 계단 오르기\n// dp[i] = i번째 계단까지 최대 점수\nint StairDP(int[] score) {\n    int n = score.Length;\n    if (n == 0) return 0;\n    if (n == 1) return score[0];\n\n    int[] dp = new int[n];\n    dp[0] = score[0];\n    dp[1] = score[0] + score[1];\n\n    for (int i = 2; i < n; i++)\n        dp[i] = Math.Max(dp[i - 2], (i >= 3 ? dp[i - 3] : 0) + score[i - 1]) + score[i];\n\n    return dp[n - 1];\n}",
      },
      {
        term: "LIS (최장 증가 부분 수열)",
        oneliner: "O(n^2) DP와 O(n log n) 이분탐색 최적화 둘 다 준비",
        complexity: "DP O(n^2) / 이분탐색 O(n log n)",
        detail: [
          "O(n^2): dp[i] = i에서 끝나는 LIS 길이",
          "O(n log n): tails[len] = 길이가 len+1인 증가수열의 최소 끝값",
          "tails 배열은 실제 LIS 자체가 아니라 길이 계산용 요약 구조",
          "각 원소를 lower bound로 치환하면 길이는 유지되고 확장 가능성 증가",
          "면접 포인트: 왜 tails를 최소로 유지해야 하는지 설명",
          "실제 수열 복원이 필요하면 parent + index 배열 추가",
          "중복 처리: strictly increasing이면 lower bound, non-decreasing이면 upper bound",
          "코테 실수: BinarySearch 반환값(음수) 처리 미흡",
        ],
        csharp:
          "int LISLength(int[] nums) {\n    var tails = new List<int>();\n    foreach (int x in nums) {\n        int lo = 0, hi = tails.Count;\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (tails[mid] < x) lo = mid + 1;\n            else hi = mid;\n        }\n\n        if (lo == tails.Count) tails.Add(x);\n        else tails[lo] = x;\n    }\n    return tails.Count;\n}",
      },
      {
        term: "0/1 배낭 문제 (Knapsack)",
        oneliner: "아이템을 한 번만 선택 가능할 때 대표 DP. 역순 루프가 핵심",
        complexity: "시간 O(nW) / 공간 O(W)",
        detail: [
          "dp[w] = 현재까지 고려한 아이템으로 무게 w에서의 최대 가치",
          "0/1 조건 때문에 w를 큰 값에서 작은 값으로 역순 순회해야 중복 선택 방지",
          "정순 순회는 같은 아이템을 여러 번 선택하는 완전 배낭과 동일해짐",
          "면접 포인트: 2D→1D 압축 시 루프 방향이 왜 바뀌는지 설명",
          "W가 매우 크면 가치 기준 DP 또는 meet-in-the-middle 고려",
          "아이템 복원은 선택 여부 배열을 별도로 저장하면 가능",
          "코테 실수: dp 초기값/불가능 상태를 0으로 두어 오답이 섞임",
          "변형: 부분합, 동전 문제, 최소 비용 경로 등으로 자주 파생",
        ],
        csharp:
          "int Knapsack01((int w, int v)[] items, int W) {\n    int[] dp = new int[W + 1];\n\n    foreach (var (w, v) in items) {\n        for (int cap = W; cap >= w; cap--) {\n            dp[cap] = Math.Max(dp[cap], dp[cap - w] + v);\n        }\n    }\n\n    return dp[W];\n}",
      },
    ],
  },
  {
    id: "string-algorithms",
    title: "문자열 알고리즘",
    color: "white",
    items: [
      {
        term: "KMP (Knuth-Morris-Pratt)",
        oneliner: "실패 함수(pi)로 패턴 재비교를 건너뛰어 O(n+m) 매칭",
        complexity: "시간 O(n+m) / 공간 O(m)",
        detail: [
          "pi[i]: pattern[0..i]의 접두사=접미사 최대 길이",
          "불일치 시 j를 pi[j-1]로 점프해 이미 검증한 비교를 재활용",
          "텍스트 포인터 i는 뒤로 가지 않으므로 선형 시간 보장",
          "면접 포인트: 브루트포스 O(nm)와의 차이를 예시로 설명",
          "부분 문자열 탐색뿐 아니라 반복 패턴 판정에도 활용",
          "Unicode/대소문자 무시 요구 시 전처리 규칙부터 통일",
          "코테 실수: pi 구성 루프와 매칭 루프에서 j 갱신 조건 혼동",
          "실무에서도 로그 탐색, 금칙어 필터, DNA 문자열 분석에 사용",
        ],
        csharp:
          "int[] BuildPi(string p) {\n    int m = p.Length;\n    int[] pi = new int[m];\n    for (int i = 1, j = 0; i < m; i++) {\n        while (j > 0 && p[i] != p[j]) j = pi[j - 1];\n        if (p[i] == p[j]) pi[i] = ++j;\n    }\n    return pi;\n}\n\nList<int> KmpSearch(string s, string p) {\n    var pi = BuildPi(p);\n    var pos = new List<int>();\n    for (int i = 0, j = 0; i < s.Length; i++) {\n        while (j > 0 && s[i] != p[j]) j = pi[j - 1];\n        if (s[i] == p[j]) {\n            if (j == p.Length - 1) {\n                pos.Add(i - p.Length + 1);\n                j = pi[j];\n            } else j++;\n        }\n    }\n    return pos;\n}",
      },
      {
        term: "Rabin-Karp (해시 기반 매칭)",
        oneliner: "롤링 해시로 다중 패턴/부분문자열 비교를 빠르게",
        complexity: "평균 O(n+m) / 해시 충돌 시 최악 O(nm)",
        detail: [
          "길이 m 윈도우 해시를 O(1)로 갱신(rolling)하며 패턴 해시와 비교",
          "해시가 같으면 실제 문자열 비교로 충돌 검증",
          "다중 패턴 검색(여러 패턴 해시 Set)에서 특히 효율적",
          "면접 포인트: KMP와 비교해 장단점(구현 단순, 충돌 위험) 설명",
          "모듈러 연산에서 음수 보정 필수: (x % mod + mod) % mod",
          "long 범위를 벗어나지 않도록 mod, base를 신중히 선택",
          "이중 해시를 사용하면 충돌 확률 크게 감소",
          "코테 실수: pow(base, m-1) 관리 누락으로 윈도우 제거값 계산 오류",
        ],
        csharp:
          "bool ContainsPattern(string text, string pat) {\n    if (pat.Length > text.Length) return false;\n\n    const long MOD = 1_000_000_007;\n    const long BASE = 911382323;\n\n    int m = pat.Length;\n    long pow = 1;\n    for (int i = 1; i < m; i++) pow = (pow * BASE) % MOD;\n\n    long ph = 0, th = 0;\n    for (int i = 0; i < m; i++) {\n        ph = (ph * BASE + pat[i]) % MOD;\n        th = (th * BASE + text[i]) % MOD;\n    }\n\n    for (int i = 0; i <= text.Length - m; i++) {\n        if (ph == th && text.AsSpan(i, m).SequenceEqual(pat)) return true;\n        if (i + m < text.Length) {\n            th = (th - text[i] * pow) % MOD;\n            if (th < 0) th += MOD;\n            th = (th * BASE + text[i + m]) % MOD;\n        }\n    }\n    return false;\n}",
      },
      {
        term: "Z 알고리즘",
        oneliner: "각 위치에서 접두사와 일치하는 최대 길이 배열을 O(n)에 계산",
        complexity: "시간 O(n) / 공간 O(n)",
        detail: [
          "Z[i] = s[i..]와 s[0..]의 최대 공통 접두사 길이",
          "[l, r] 윈도우를 유지해 이미 계산된 정보를 재활용",
          "패턴 매칭은 pattern + '$' + text 조합으로 변환해 Z값이 pattern 길이인 위치 탐색",
          "KMP 대안으로 자주 사용되며 구현도 비교적 직관적",
          "면접 포인트: 왜 선형 시간인지(윈도우 r가 단조 증가) 설명",
          "문자열 주기성, 반복 문자열 분석 문제에도 응용 가능",
          "코테 실수: i<=r 조건에서 인덱스 변환(i-l) 처리 누락",
          "문자열 길이가 0/1일 때 경계 조건 처리",
        ],
        csharp:
          "int[] BuildZ(string s) {\n    int n = s.Length;\n    int[] z = new int[n];\n    int l = 0, r = 0;\n\n    for (int i = 1; i < n; i++) {\n        if (i <= r) z[i] = Math.Min(r - i + 1, z[i - l]);\n\n        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;\n\n        if (i + z[i] - 1 > r) {\n            l = i;\n            r = i + z[i] - 1;\n        }\n    }\n    return z;\n}",
      },
    ],
  },
  {
    id: "math-greedy-divide",
    title: "수학 / 그리디 / 분할정복",
    color: "white",
    items: [
      {
        term: "유클리드 호제법 + 모듈러 연산",
        oneliner: "GCD/LCM/모듈러는 수학 문제의 필수 기반",
        complexity: "GCD O(log min(a,b))",
        detail: [
          "gcd(a,b)=gcd(b,a%b)로 빠르게 최대공약수 계산",
          "lcm(a,b)=a/gcd(a,b)*b (곱셈 오버플로우 순서 주의)",
          "모듈러 덧셈/곱셈은 매 연산마다 mod 적용해 범위 유지",
          "거듭제곱은 분할정복 빠른 거듭제곱(binary exponentiation) 사용",
          "면접 포인트: 왜 호제법이 빠른지(나머지가 급격히 감소) 설명",
          "소수 판별/에라토스테네스 체와 함께 출제 빈도 높음",
          "코테 실수: 음수 모듈러 결과 보정 누락",
          "조합(nCr mod p) 문제에서 팩토리얼 + 역원 전처리로 확장",
        ],
        csharp:
          "long Gcd(long a, long b) {\n    while (b != 0) {\n        long t = a % b;\n        a = b;\n        b = t;\n    }\n    return Math.Abs(a);\n}\n\nlong Lcm(long a, long b) => a / Gcd(a, b) * b;\n\nlong ModPow(long a, long e, long mod) {\n    long res = 1 % mod;\n    a %= mod;\n    while (e > 0) {\n        if ((e & 1) == 1) res = (res * a) % mod;\n        a = (a * a) % mod;\n        e >>= 1;\n    }\n    return res;\n}",
      },
      {
        term: "그리디 증명 패턴",
        oneliner: "항상 지역 최적이 전역 최적이 되는 근거(교환 논증) 제시가 핵심",
        complexity: "문제별 상이 (대개 정렬 O(n log n) + 선형 스캔)",
        detail: [
          "그리디는 '왜 지금 이 선택이 안전한가' 증명이 없으면 오답 위험",
          "대표 증명: 교환 논증(exchange argument), cut property, stay-ahead",
          "회의실 배정: 종료 시간이 빠른 회의부터 선택하면 최적",
          "최소 스패닝 트리: 크루스칼/프림은 cut property로 정당화",
          "면접 포인트: DP와의 차이(그리디는 되돌림 없음) 설명",
          "정렬 기준 하나가 답을 좌우하므로 comparator 설정을 신중히",
          "코테 실수: 직관으로만 구현하고 증명 없이 반례를 놓침",
          "문제 제한이 작으면 그리디 vs DP 결과 비교로 반례 테스트 권장",
        ],
        csharp:
          "// 회의실 배정(최대 개수)\nint MaxMeetings((int s, int e)[] meetings) {\n    Array.Sort(meetings, (a, b) =>\n        a.e != b.e ? a.e.CompareTo(b.e) : a.s.CompareTo(b.s));\n\n    int count = 0;\n    int end = int.MinValue;\n    foreach (var (s, e) in meetings) {\n        if (s >= end) {\n            count++;\n            end = e;\n        }\n    }\n    return count;\n}",
      },
      {
        term: "분할정복 + 역전쌍 카운트",
        oneliner: "병합정렬 과정에서 역전쌍(inversion)을 O(n log n)에 계산",
        complexity: "시간 O(n log n) / 공간 O(n)",
        detail: [
          "역전쌍: i<j 이면서 arr[i] > arr[j]인 쌍의 개수",
          "브루트포스 O(n^2) 대신 merge 단계에서 한 번에 누적",
          "왼쪽 값이 오른쪽 값보다 크면 남은 왼쪽 원소 개수만큼 역전쌍 증가",
          "면접 포인트: 왜 추가되는 개수가 (mid-i+1)인지 설명",
          "분할정복 대표 예시로 시간복잡도 분석 질문이 자주 나옴",
          "long 카운터 사용(쌍 개수가 int 범위 초과 가능)",
          "코테 실수: 임시 배열 병합 후 원본 반영 누락",
          "응용: Kendall tau distance, 배열 유사도 비교",
        ],
        csharp:
          "long CountInv(int[] arr) {\n    int n = arr.Length;\n    int[] tmp = new int[n];\n    return MergeSort(arr, tmp, 0, n - 1);\n}\n\nlong MergeSort(int[] a, int[] t, int l, int r) {\n    if (l >= r) return 0;\n    int m = (l + r) / 2;\n    long inv = MergeSort(a, t, l, m) + MergeSort(a, t, m + 1, r);\n\n    int i = l, j = m + 1, k = l;\n    while (i <= m && j <= r) {\n        if (a[i] <= a[j]) t[k++] = a[i++];\n        else {\n            t[k++] = a[j++];\n            inv += (m - i + 1);\n        }\n    }\n    while (i <= m) t[k++] = a[i++];\n    while (j <= r) t[k++] = a[j++];\n    for (int p = l; p <= r; p++) a[p] = t[p];\n    return inv;\n}",
      },
    ],
  },
  {
    id: "simulation-and-sorting",
    title: "시뮬레이션 / 정렬 / 기본 탐색",
    color: "white",
    items: [
      {
        term: "그래프 DFS/BFS 템플릿 비교",
        oneliner: "DFS는 깊게, BFS는 레벨별. 둘 다 O(V+E)이지만 쓰는 목적이 다름",
        complexity: "시간 O(V+E) / 공간 O(V)",
        detail: [
          "DFS: 경로 존재성, 백트래킹, 위상정렬(DFS 버전), 컴포넌트 분해에 강함",
          "BFS: 무가중치 그래프 최단거리, 최소 횟수/최소 단계 문제의 기본",
          "면접 포인트: 같은 복잡도여도 문제 목적(최단거리 vs 전수 탐색)으로 선택",
          "재귀 DFS는 깊은 그래프에서 StackOverflow 위험. 반복 DFS 대안 준비",
          "BFS는 방문 체크를 enqueue 시점에 해야 중복 큐잉이 안 생김",
          "그리드 탐색에서는 방향 벡터(dr/dc)와 경계 검사 순서가 중요",
          "코테 실수: visited 초기화 누락, 무방향 그래프에서 역방향 간선 누락",
          "실전 팁: 입력이 클 때 인접 리스트 + 비재귀 탐색으로 안정성 확보",
        ],
        csharp:
          "// DFS (반복)\nvoid DfsIter(int start, List<int>[] g, bool[] visited) {\n    var st = new Stack<int>();\n    st.Push(start);\n    visited[start] = true;\n\n    while (st.Count > 0) {\n        int u = st.Pop();\n        foreach (int v in g[u]) {\n            if (visited[v]) continue;\n            visited[v] = true;\n            st.Push(v);\n        }\n    }\n}\n\n// BFS\nint[] BfsDist(int start, List<int>[] g) {\n    int n = g.Length;\n    int[] dist = Enumerable.Repeat(-1, n).ToArray();\n    var q = new Queue<int>();\n    q.Enqueue(start);\n    dist[start] = 0;\n\n    while (q.Count > 0) {\n        int u = q.Dequeue();\n        foreach (int v in g[u]) {\n            if (dist[v] != -1) continue;\n            dist[v] = dist[u] + 1;\n            q.Enqueue(v);\n        }\n    }\n    return dist;\n}",
      },
      {
        term: "시뮬레이션 구현 패턴",
        oneliner: "문제 조건을 상태 전이로 정확히 모델링하는 능력이 구현/시뮬레이션의 핵심",
        complexity: "문제별 상이 (보통 시간축 × 상태 업데이트 비용)",
        detail: [
          "핵심은 '한 턴/한 초/한 이벤트' 단위의 상태 전이를 누락 없이 정의하는 것",
          "업데이트 순서가 결과를 바꾸는 문제(동시 이동, 충돌, 소멸)는 2단계 버퍼가 안전",
          "현재 상태를 읽고 다음 상태를 쓰는 double buffering으로 동시성 효과를 보존",
          "면접 포인트: 모델링(자료구조 선택)과 불변식(invariant) 관리 능력 보여주기",
          "엣지 케이스: 경계, 빈 상태, 동률 처리 규칙, tie-break 규칙을 먼저 고정",
          "좌표 기반 문제는 direction enum/배열로 분기 수를 줄이면 버그가 급감",
          "코테 실수: in-place 업데이트로 의도치 않은 연쇄 반영, deep copy 과다로 TLE",
          "테스트 팁: 작은 입력 수동 시뮬레이션으로 한 턴 로그 검증 후 확장",
        ],
        csharp:
          "// 동시 업데이트 예시 (double buffering)\nvoid SimulateStep(int[,] cur, int[,] nxt) {\n    int R = cur.GetLength(0), C = cur.GetLength(1);\n    for (int r = 0; r < R; r++)\n        for (int c = 0; c < C; c++)\n            nxt[r, c] = 0;\n\n    for (int r = 0; r < R; r++) {\n        for (int c = 0; c < C; c++) {\n            // cur만 읽고 nxt만 쓴다\n            if (cur[r, c] == 1) {\n                int nr = r, nc = c + 1;\n                if (nc < C) nxt[nr, nc] += 1;\n                else nxt[r, c] += 1;\n            }\n        }\n    }\n\n    // swap\n    for (int r = 0; r < R; r++)\n        for (int c = 0; c < C; c++)\n            cur[r, c] = nxt[r, c];\n}",
      },
      {
        term: "비교 기반 정렬 (Quick / Merge / Heap)",
        oneliner: "코테에서 정렬 자체 구현보다 특성(안정성/최악복잡도/메모리) 비교가 자주 질문됨",
        complexity: "Quick 평균 O(n log n), 최악 O(n^2) / Merge O(n log n) / Heap O(n log n)",
        detail: [
          "Quick Sort: 평균 빠르고 캐시 친화적이나 피벗이 나쁘면 O(n^2)",
          "Merge Sort: 항상 O(n log n), 안정 정렬(stable), 추가 메모리 O(n)",
          "Heap Sort: 추가 메모리 거의 없음(in-place)이나 안정 정렬 아님",
          "IntroSort는 Quick의 최악을 Heap으로 보완한 하이브리드 (C# Array.Sort 내부 계열)",
          "면접 포인트: '왜 이 상황에서 이 정렬?'을 데이터 특성으로 설명",
          "거의 정렬된 입력에서는 삽입 정렬 계열이 실제로 빠를 수 있음",
          "정렬 기준이 여러 개면 ThenBy 또는 커스텀 comparer 명확화",
          "코테 실수: 비교 함수에서 overflow (a-b) 사용, 동등 조건 처리 누락",
        ],
        csharp:
          "// C# 커스텀 정렬 안전 패턴\nArray.Sort(arr, (a, b) => {\n    int cmp = a.Key.CompareTo(b.Key);\n    if (cmp != 0) return cmp;\n    return b.Score.CompareTo(a.Score); // 2차 기준\n});\n\n// List<T>도 동일\nlist.Sort((x, y) => x.Time.CompareTo(y.Time));",
      },
      {
        term: "선형 정렬 (Counting / Radix)",
        oneliner: "키 범위가 제한되면 O(n log n)보다 빠른 O(n+k), O(d(n+k)) 정렬 가능",
        complexity: "Counting O(n+k) / Radix O(d(n+k))",
        detail: [
          "Counting Sort: 값 범위 k가 작을 때 매우 강력. 안정 정렬로 구현 가능",
          "Radix Sort: 자릿수별 안정 정렬(보통 Counting)을 반복",
          "비교 정렬 하한 O(n log n)을 피해갈 수 있는 대표적 케이스",
          "면접 포인트: 값 범위가 큰데 원소 수가 적으면 좌표 압축 후 사용 가능",
          "음수 처리, offset, 메모리(k 크기) 계산을 명확히 해야 안전",
          "문자열/고정 길이 키 정렬에서도 Radix 응용 가능",
          "코테 실수: Counting 배열 인덱스 범위 계산 오류, 안정성 보장 누락",
          "범용성은 낮지만 조건이 맞으면 압도적으로 빠름",
        ],
        csharp:
          "int[] CountingSort(int[] nums, int maxVal) {\n    int[] cnt = new int[maxVal + 1];\n    foreach (int x in nums) cnt[x]++;\n\n    int[] outArr = new int[nums.Length];\n    int idx = 0;\n    for (int v = 0; v <= maxVal; v++) {\n        while (cnt[v]-- > 0) outArr[idx++] = v;\n    }\n    return outArr;\n}",
      },
    ],
  },
  {
    id: "graph-advanced",
    title: "그래프 고급 (코테 상위 빈출)",
    color: "yellow",
    items: [
      {
        term: "최소 스패닝 트리 (Kruskal / Prim)",
        oneliner: "모든 정점을 최소 비용으로 연결. 네트워크/도로/전력망 문제의 정석",
        complexity: "Kruskal: O(E log E) / Prim(PQ): O(E log V)",
        detail: [
          "MST는 사이클 없이 모든 정점을 연결하면서 간선 가중치 합이 최소인 트리",
          "Kruskal: 간선 정렬 후 Union-Find로 사이클 없는 간선만 채택",
          "Prim: 임의 시작점에서 가장 싼 간선을 확장하며 트리 성장",
          "희소 그래프에서는 Kruskal, 인접리스트+우선순위큐 Prim도 매우 자주 사용",
          "면접 포인트: cut property 설명 가능해야 함 (가장 가벼운 cut 간선은 안전)",
          "연결 그래프가 아니면 결과는 MST가 아니라 MSF(최소 신장 포레스트)",
          "코테 실수: 정점 수 n일 때 간선 n-1개 채택되면 즉시 종료 가능한 최적화 누락",
          "음수 가중치가 있어도 MST는 정상 동작 (최단경로 알고리즘과 다름)",
        ],
        csharp:
          "// Kruskal\nint MstKruskal(int n, List<(int u, int v, int w)> edges) {\n    edges.Sort((a, b) => a.w.CompareTo(b.w));\n    var uf = new UnionFind(n);\n    int cost = 0, used = 0;\n\n    foreach (var (u, v, w) in edges) {\n        if (!uf.Union(u, v)) continue;\n        cost += w;\n        if (++used == n - 1) break;\n    }\n\n    return used == n - 1 ? cost : -1;\n}\n\nclass UnionFind {\n    private readonly int[] p, r;\n    public UnionFind(int n) {\n        p = Enumerable.Range(0, n).ToArray();\n        r = new int[n];\n    }\n    public int Find(int x) => p[x] == x ? x : (p[x] = Find(p[x]));\n    public bool Union(int a, int b) {\n        a = Find(a); b = Find(b);\n        if (a == b) return false;\n        if (r[a] < r[b]) (a, b) = (b, a);\n        p[b] = a;\n        if (r[a] == r[b]) r[a]++;\n        return true;\n    }\n}",
      },
      {
        term: "강한 연결 요소 (SCC: Tarjan / Kosaraju)",
        oneliner: "방향 그래프를 SCC 단위로 압축하면 DAG가 되어 많은 문제가 단순화됨",
        complexity: "시간 O(V+E) / 공간 O(V+E)",
        detail: [
          "SCC는 서로 도달 가능한 정점들의 최대 집합",
          "2-SAT, 사이클 군집 분석, 의존성 순환 압축 문제의 핵심 도구",
          "Tarjan: DFS 한 번으로 SCC 추출 (disc/low + 스택)",
          "Kosaraju: 정방향 DFS 후 역방향 그래프에서 finishing order 역순 DFS",
          "SCC를 노드로 압축하면 DAG가 되므로 위상정렬/DP 적용 가능",
          "면접 포인트: low-link 값 의미(자기 혹은 조상으로 되돌아갈 수 있는 최소 발견 순서)",
          "코테 실수: onStack 처리 누락으로 SCC 경계가 무너짐",
          "정점이 많고 재귀 깊이가 크면 반복 DFS 버전 고려",
        ],
        csharp:
          "// Tarjan SCC (핵심 골격)\nvoid Tarjan(int n, List<int>[] g) {\n    int id = 0;\n    int[] disc = Enumerable.Repeat(-1, n).ToArray();\n    int[] low = new int[n];\n    bool[] onStack = new bool[n];\n    var st = new Stack<int>();\n    var sccs = new List<List<int>>();\n\n    void Dfs(int u) {\n        disc[u] = low[u] = id++;\n        st.Push(u);\n        onStack[u] = true;\n\n        foreach (int v in g[u]) {\n            if (disc[v] == -1) {\n                Dfs(v);\n                low[u] = Math.Min(low[u], low[v]);\n            } else if (onStack[v]) {\n                low[u] = Math.Min(low[u], disc[v]);\n            }\n        }\n\n        if (low[u] == disc[u]) {\n            var comp = new List<int>();\n            while (true) {\n                int x = st.Pop();\n                onStack[x] = false;\n                comp.Add(x);\n                if (x == u) break;\n            }\n            sccs.Add(comp);\n        }\n    }\n\n    for (int i = 0; i < n; i++) if (disc[i] == -1) Dfs(i);\n}",
      },
      {
        term: "LCA (Lowest Common Ancestor) + Binary Lifting",
        oneliner: "트리 쿼리(공통 조상, 거리 계산)를 O(log N)으로 처리",
        complexity: "전처리 O(N log N) / 쿼리 O(log N) / 공간 O(N log N)",
        detail: [
          "LCA(u,v): 두 노드의 가장 가까운 공통 조상. 트리 경로 문제의 기본",
          "Binary Lifting: parent[k][v] = v의 2^k번째 조상 테이블 전처리",
          "깊이를 먼저 맞춘 뒤 높은 비트부터 점프해 조상을 끌어올림",
          "트리 거리: dist(u,v)=depth[u]+depth[v]-2*depth[LCA(u,v)]",
          "면접 포인트: 왜 쿼리가 O(log N)인지 (최대 logN번 점프)",
          "Euler Tour + RMQ 방식도 있으나 구현 난이도 대비 Binary Lifting이 코테 친화적",
          "코테 실수: 루트의 부모를 -1로 둘 때 경계 체크 누락",
          "정점 번호가 1-based/0-based인지 통일하지 않으면 오답 확률이 높음",
        ],
        csharp:
          "class LcaSolver {\n    readonly int n, LOG;\n    readonly List<int>[] g;\n    readonly int[,] up;\n    readonly int[] depth;\n\n    public LcaSolver(List<int>[] graph, int root = 0) {\n        g = graph;\n        n = g.Length;\n        LOG = (int)Math.Ceiling(Math.Log2(Math.Max(2, n)));\n        up = new int[LOG + 1, n];\n        depth = new int[n];\n        for (int i = 0; i < n; i++) up[0, i] = -1;\n        Dfs(root, -1);\n        for (int k = 1; k <= LOG; k++)\n            for (int v = 0; v < n; v++)\n                up[k, v] = up[k - 1, v] == -1 ? -1 : up[k - 1, up[k - 1, v]];\n    }\n\n    void Dfs(int u, int p) {\n        up[0, u] = p;\n        foreach (int v in g[u]) {\n            if (v == p) continue;\n            depth[v] = depth[u] + 1;\n            Dfs(v, u);\n        }\n    }\n\n    public int Lca(int a, int b) {\n        if (depth[a] < depth[b]) (a, b) = (b, a);\n        int diff = depth[a] - depth[b];\n        for (int k = 0; k <= LOG; k++)\n            if (((diff >> k) & 1) == 1) a = up[k, a];\n        if (a == b) return a;\n        for (int k = LOG; k >= 0; k--) {\n            if (up[k, a] != up[k, b]) {\n                a = up[k, a];\n                b = up[k, b];\n            }\n        }\n        return up[0, a];\n    }\n}",
      },
    ],
  },
  {
    id: "game-client-algorithms",
    title: "게임 클라이언트 실전 알고리즘",
    color: "red",
    items: [
      {
        term: "A* 경로 탐색 (A-Star)",
        oneliner: "실제 게임 경로 탐색의 표준. Dijkstra에 휴리스틱을 더해 탐색 범위 축소",
        complexity: "최악 O(E log V), 휴리스틱이 좋을수록 평균 성능 향상",
        detail: [
          "f(n)=g(n)+h(n). g는 시작점부터 실제 비용, h는 목표까지 추정 비용",
          "h가 admissible(낙관적)하면 최단 경로 보장, consistent면 재오픈이 줄어듦",
          "격자 맨해튼/유클리드 휴리스틱은 타일 이동 규칙과 맞춰 선택",
          "open set은 PriorityQueue, closed set은 방문 표시로 구현",
          "면접 포인트: Dijkstra 대비 A*가 빠른 이유(목표 방향으로 편향 탐색) 설명",
          "타이브레이커(동일 f일 때 g 큰/작은 우선)는 경로 모양에 영향",
          "게임 실무에서는 NavMesh 노드 그래프 + A* 조합이 일반적",
          "코테 실수: h를 과대평가하는 휴리스틱을 써 최적성 깨짐",
        ],
        csharp:
          "int AStar(int[,] grid, (int r, int c) s, (int r, int c) t) {\n    int R = grid.GetLength(0), C = grid.GetLength(1);\n    int[,] g = new int[R, C];\n    for (int r = 0; r < R; r++)\n        for (int c = 0; c < C; c++) g[r, c] = int.MaxValue;\n\n    int H((int r, int c) a, (int r, int c) b) =>\n        Math.Abs(a.r - b.r) + Math.Abs(a.c - b.c); // Manhattan\n\n    var pq = new PriorityQueue<(int r, int c), int>();\n    g[s.r, s.c] = 0;\n    pq.Enqueue(s, H(s, t));\n\n    int[] dr = { -1, 1, 0, 0 };\n    int[] dc = { 0, 0, -1, 1 };\n\n    while (pq.Count > 0) {\n        var cur = pq.Dequeue();\n        if (cur == t) return g[cur.r, cur.c];\n\n        for (int d = 0; d < 4; d++) {\n            int nr = cur.r + dr[d], nc = cur.c + dc[d];\n            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;\n            if (grid[nr, nc] == 1) continue;\n\n            int ng = g[cur.r, cur.c] + 1;\n            if (ng >= g[nr, nc]) continue;\n            g[nr, nc] = ng;\n            int f = ng + H((nr, nc), t);\n            pq.Enqueue((nr, nc), f);\n        }\n    }\n\n    return -1;\n}",
      },
      {
        term: "Sweep and Prune (Broad-Phase Collision)",
        oneliner: "충돌 후보를 빠르게 줄이는 1차 필터. 물리 엔진 broad-phase 핵심",
        complexity: "정렬 유지 시 평균 O(N + K), 프레임별 재정렬 O(N log N)",
        detail: [
          "모든 오브젝트의 AABB를 한 축(x 등)에 투영해 시작/끝 점을 정렬",
          "활성 집합(active set)과 겹치는 항목만 충돌 후보로 추가",
          "실제 충돌 판정(narrow-phase)은 후보 쌍에만 수행",
          "프레임 간 위치 변화가 작으면 insertion sort 계열로 매우 빠르게 유지 가능",
          "면접 포인트: O(N^2) 전체 쌍 검사 대비 왜 빠른지 설명",
          "축 선택/다중 축 조합으로 false positive를 더 줄일 수 있음",
          "동적/정적 오브젝트를 분리하면 broad-phase 비용을 더 낮출 수 있음",
          "코테 실수: 끝점 이벤트 처리 순서(start/end)가 반대로 되어 후보 누락",
        ],
        csharp:
          "record EndPoint(float X, int Id, bool IsStart);\n\nList<(int a, int b)> SweepAndPrune((float minX, float maxX)[] aabbX) {\n    var points = new List<EndPoint>(aabbX.Length * 2);\n    for (int i = 0; i < aabbX.Length; i++) {\n        points.Add(new EndPoint(aabbX[i].minX, i, true));\n        points.Add(new EndPoint(aabbX[i].maxX, i, false));\n    }\n    points.Sort((p, q) => p.X.CompareTo(q.X));\n\n    var active = new HashSet<int>();\n    var pairs = new List<(int, int)>();\n\n    foreach (var p in points) {\n        if (p.IsStart) {\n            foreach (int other in active)\n                pairs.Add((Math.Min(p.Id, other), Math.Max(p.Id, other)));\n            active.Add(p.Id);\n        } else {\n            active.Remove(p.Id);\n        }\n    }\n    return pairs;\n}",
      },
      {
        term: "고정 타임스텝 + 보간 (Fixed Timestep Loop)",
        oneliner: "프레임레이트와 물리 시뮬레이션을 분리해 결정성과 안정성을 확보",
        complexity: "업데이트 O(step 수) / 렌더 O(1)",
        detail: [
          "deltaTime 변동이 큰 환경에서 물리를 가변 dt로 돌리면 결과가 흔들리기 쉬움",
          "accumulator에 실시간 경과를 더하고 fixedDt 단위로 Update를 여러 번 실행",
          "렌더는 이전 상태(prev)와 현재 상태(curr)를 alpha로 보간해 부드럽게 표현",
          "면접 포인트: 왜 물리와 렌더를 분리해야 하는지, spiral of death 대응 설명",
          "한 프레임 최대 step 수를 제한해 프레임 드랍 시 과도한 catch-up을 방지",
          "네트워크 동기화(락스텝/리플레이)에서도 고정 스텝이 유리",
          "게임플레이 로직/충돌/애니메이션 샘플링 타이밍을 명확히 분리하면 버그 감소",
          "코테형 시뮬레이션 문제에도 동일 아이디어(시간 단위 이벤트 처리) 적용 가능",
        ],
        csharp:
          "const double fixedDt = 1.0 / 60.0;\nconst int maxSteps = 5;\n\ndouble accumulator = 0.0;\ndouble lastTime = GetNow();\n\nwhile (running) {\n    double now = GetNow();\n    accumulator += now - lastTime;\n    lastTime = now;\n\n    int steps = 0;\n    while (accumulator >= fixedDt && steps < maxSteps) {\n        prevState = currState;\n        currState = Simulate(currState, fixedDt);\n        accumulator -= fixedDt;\n        steps++;\n    }\n\n    double alpha = accumulator / fixedDt;\n    var renderState = Lerp(prevState, currState, alpha);\n    Render(renderState);\n}",
      },
      {
        term: "FSM 전이 테이블 (게임 상태 제어)",
        oneliner: "상태+입력으로 다음 상태를 결정하는 규칙 기반 알고리즘. AI/캐릭터 제어의 기본",
        complexity: "전이 조회 O(1) (테이블/딕셔너리 기준)",
        detail: [
          "상태(State)와 이벤트(Event)를 키로 다음 상태를 찾는 방식으로 분기 로직을 데이터화",
          "if/switch 체인을 줄여 상태 추가 시 코드 충돌을 줄이고 디버깅 가시성을 높임",
          "면접 포인트: 상태 패턴(OOP)과 FSM(전이 모델)은 상호 보완 관계라고 설명하면 좋음",
          "전이 가드(조건식)와 액션(onExit/onEnter)을 분리하면 유지보수가 쉬워짐",
          "게임 AI, UI 플로우, 네트워크 접속 상태(Connecting/Authenticating/InGame) 등에 폭넓게 사용",
          "복잡도가 커지면 Hierarchical FSM(HFSM) 또는 Behavior Tree로 확장",
          "코테/면접 실수: 상태 전이가 누락되어 dead state가 생기거나, 예상치 못한 self-loop가 남음",
        ],
        csharp:
          "enum State { Idle, Chase, Attack }\nenum Event { SeeEnemy, InRange, LostEnemy }\n\nvar trans = new Dictionary<(State, Event), State> {\n    [(State.Idle, Event.SeeEnemy)] = State.Chase,\n    [(State.Chase, Event.InRange)] = State.Attack,\n    [(State.Attack, Event.LostEnemy)] = State.Idle,\n};\n\nState Next(State cur, Event ev) => trans.TryGetValue((cur, ev), out var nxt) ? nxt : cur;",
      },
      {
        term: "K-Means 군집화",
        oneliner: "데이터를 K개 중심점으로 반복 재할당해 군집을 찾는 대표 알고리즘",
        complexity: "시간 O(n * k * iter) / 공간 O(n + k)",
        detail: [
          "1) 중심점 초기화 2) 각 점을 가장 가까운 중심에 할당 3) 중심 재계산을 수렴까지 반복",
          "초기 중심 선택이 품질에 큰 영향. K-Means++를 쓰면 로컬 최적해 위험 완화",
          "면접 포인트: 비지도 학습이며 군집 수 K를 사전에 정해야 한다는 한계를 설명",
          "게임 활용: 플레이어 행동 세그먼트 분석, 맵 히트맵 구역 자동 분류, 밸런스 데이터 클러스터링",
          "거리 함수는 보통 유클리드. 도메인에 따라 코사인 거리/정규화 전처리 필요",
          "수렴 판정: 중심 이동량이 임계값 이하 또는 최대 반복 횟수 도달",
          "코테 실수: 빈 클러스터 처리 누락(해당 중심을 재초기화해야 함)",
        ],
        csharp:
          "for (int iter = 0; iter < maxIter; iter++) {\n    // assign\n    for (int i = 0; i < points.Length; i++)\n        label[i] = ArgMinCenter(points[i], centers);\n\n    // update\n    RecomputeCenters(points, label, centers);\n\n    if (Converged(prevCenters, centers, eps)) break;\n}",
      },
      {
        term: "Boids 군집 행동 (Separation / Alignment / Cohesion)",
        oneliner: "로컬 규칙 3개로 집단 이동을 만드는 군집 시뮬레이션 알고리즘",
        complexity: "기본 O(n^2), 공간 분할 적용 시 근사 O(n)",
        detail: [
          "분리(Separation): 너무 가까운 이웃에서 멀어지기",
          "정렬(Alignment): 이웃 평균 속도 방향으로 맞추기",
          "응집(Cohesion): 이웃 중심 방향으로 모이기",
          "면접 포인트: 단순 규칙이 복잡한 집단 행동을 만든다는 emergent behavior 설명",
          "naive 구현은 모든 쌍 비교로 O(n^2). 그리드/쿼드트리로 이웃 탐색 최적화 필수",
          "게임 활용: 군중/새 떼/물고기 떼/드론 스웜 움직임",
          "가중치 튜닝이 핵심이며 separation이 약하면 겹침, cohesion이 강하면 과도한 뭉침 발생",
        ],
        csharp:
          "Vector2 acc =\n    wSep * Separation(i, neighbors) +\n    wAli * Alignment(i, neighbors) +\n    wCoh * Cohesion(i, neighbors);\n\nvel[i] = Clamp(vel[i] + acc * dt, maxSpeed);\npos[i] += vel[i] * dt;",
      },
      {
        term: "Perlin/FBM 노이즈 기반 절차적 지형 생성",
        oneliner: "연속 노이즈를 합성해 자연스러운 높이맵/바이옴을 만드는 절차적 생성 핵심",
        complexity: "시간 O(W*H*octaves) / 공간 O(W*H)",
        detail: [
          "Perlin/Simplex 노이즈는 인접 샘플이 부드럽게 연결되어 지형 생성에 적합",
          "FBM(fractal brownian motion): 주파수/진폭을 옥타브로 합성해 디테일을 추가",
          "면접 포인트: seed 기반 재현성(determinism) 덕분에 서버-클라 동기화/리플레이에 유리",
          "높이값 외에 온도/습도 노이즈를 결합해 바이옴(사막/숲/설원) 분기 가능",
          "게임 실무에서는 chunk 단위로 생성하고 비동기 스트리밍으로 끊김을 줄임",
          "노이즈 샘플링 좌표 스케일이 너무 작으면 반복 패턴, 너무 크면 디테일 부족",
          "코테/면접 실수: 랜덤값만 찍어 노이즈로 오해(연속성 없는 white noise는 지형 품질이 낮음)",
        ],
        csharp:
          "for (int y = 0; y < H; y++)\nfor (int x = 0; x < W; x++) {\n    float amp = 1f, freq = 1f, h = 0f;\n    for (int o = 0; o < octaves; o++) {\n        h += amp * Perlin((x + seedX) * scale * freq, (y + seedY) * scale * freq);\n        amp *= persistence;\n        freq *= lacunarity;\n    }\n    height[y, x] = h;\n}",
      },
      {
        term: "BSP + Cellular Automata 던전 생성",
        oneliner: "공간 분할(BSP)로 방 구조를 잡고, 셀룰러 오토마타로 자연스러운 동굴 형태를 보정",
        complexity: "BSP O(split 수), CA O(W*H*iter)",
        detail: [
          "BSP(Binary Space Partition): 맵을 재귀 분할해 방 후보 영역을 확보",
          "각 리프에 방을 만들고 복도로 연결하면 플레이 가능한 토폴로지를 확보하기 쉬움",
          "Cellular Automata는 벽/빈칸 이웃 규칙으로 동굴형 자연스러운 경계를 생성",
          "면접 포인트: 생성 단계(구조 확보 → 디테일 노이즈 보정)를 분리한 하이브리드 설계 설명",
          "실무에서는 시작/보스/상점 같은 필수 룸 제약을 추가해 디자인 의도를 반영",
          "연결성 검증(도달 가능성 BFS) 후 불량 맵을 재생성하는 검수 루프가 필요",
          "코테 실수: 분할 최소 크기 조건 누락으로 지나치게 좁은 방/막힌 복도 생성",
        ],
        csharp:
          "// 1) BSP 분할로 leaf 생성\n// 2) leaf마다 room carve\n// 3) 인접 room 연결 corridor carve\n// 4) Cellular Automata 후처리 + 연결성 BFS 검증",
      },
    ],
  },
  {
    id: "sorting-algorithms",
    title: "정렬 알고리즘 완전 정복",
    color: "yellow",
    items: [
      {
        term: "버블 정렬 (Bubble Sort)",
        oneliner: "인접 원소를 반복 교환. 가장 단순하나 실전에서 거의 사용하지 않음",
        complexity: "최선 O(n) / 평균·최악 O(n²) / 공간 O(1) / 안정 정렬",
        detail: [
          "매 패스마다 가장 큰 값이 끝으로 '버블업'되는 구조",
          "장점: 구현이 가장 단순. 이미 정렬된 배열은 O(n) (조기 종료 최적화 적용 시)",
          "단점: 교환 횟수가 많아 평균·최악 O(n²)로 느림. 캐시 비친화적",
          "사용 시점: 교육 목적, 극소 규모(n<20) 데이터, 거의 정렬된 데이터 판별용",
          "최적화: swapped 플래그로 교환이 없으면 조기 종료",
          "최적화2: 각 패스에서 실제 마지막 교환 위치까지만 다음 패스 범위로 축소 가능",
          "면접 포인트: 왜 실무에서 안 쓰는지(교환 횟수 과다, 캐시 미스) 설명",
          "코테 실수: 조기 종료 조건 없이 무조건 O(n²) 수행",
        ],
        csharp:
          "void BubbleSort(int[] a) {\n    int n = a.Length;\n    for (int i = 0; i < n - 1; i++) {\n        bool swapped = false;\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (a[j] > a[j + 1]) {\n                (a[j], a[j + 1]) = (a[j + 1], a[j]);\n                swapped = true;\n            }\n        }\n        if (!swapped) break; // 조기 종료\n    }\n}\n\n// 최적화: 마지막 교환 위치로 범위 축소\nvoid BubbleSortOpt(int[] a) {\n    int n = a.Length;\n    int last = n - 1;\n    while (last > 0) {\n        int newLast = 0;\n        for (int j = 0; j < last; j++) {\n            if (a[j] > a[j + 1]) {\n                (a[j], a[j + 1]) = (a[j + 1], a[j]);\n                newLast = j;\n            }\n        }\n        last = newLast;\n    }\n}",
      },
      {
        term: "선택 정렬 (Selection Sort)",
        oneliner: "매 패스마다 최솟값을 선택해 앞으로 배치. 교환 횟수가 O(n)으로 적음",
        complexity: "최선·평균·최악 모두 O(n²) / 공간 O(1) / 불안정 정렬",
        detail: [
          "i번째 패스에서 i~n-1 범위의 최솟값을 찾아 a[i]와 교환",
          "장점: 교환 횟수가 정확히 n-1번. 쓰기 비용이 큰 플래시 메모리 환경에서 유리",
          "단점: 비교 횟수가 항상 O(n²). 이미 정렬돼 있어도 O(n²) 수행",
          "불안정 정렬: 동일 값의 상대 순서가 바뀔 수 있음",
          "사용 시점: 메모리 쓰기 비용이 매우 큰 환경, 소규모 배열",
          "최적화: 한 패스에서 최솟값과 최댓값을 동시에 찾으면 패스 수를 절반으로 줄임 (이중 선택 정렬)",
          "면접 포인트: 버블과 비교 수는 같지만 교환 수가 훨씬 적다는 점 설명",
          "코테 실수: 안정성이 필요한 문제에 선택 정렬 사용",
        ],
        csharp:
          "void SelectionSort(int[] a) {\n    int n = a.Length;\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++)\n            if (a[j] < a[minIdx]) minIdx = j;\n        if (minIdx != i)\n            (a[i], a[minIdx]) = (a[minIdx], a[i]);\n    }\n}\n\n// 최적화: 이중 선택 정렬 (동시에 min/max 선택)\nvoid DoubleSelectionSort(int[] a) {\n    int lo = 0, hi = a.Length - 1;\n    while (lo < hi) {\n        int minIdx = lo, maxIdx = lo;\n        for (int j = lo + 1; j <= hi; j++) {\n            if (a[j] < a[minIdx]) minIdx = j;\n            if (a[j] > a[maxIdx]) maxIdx = j;\n        }\n        (a[lo], a[minIdx]) = (a[minIdx], a[lo]);\n        if (maxIdx == lo) maxIdx = minIdx;\n        (a[hi], a[maxIdx]) = (a[maxIdx], a[hi]);\n        lo++; hi--;\n    }\n}",
      },
      {
        term: "삽입 정렬 (Insertion Sort)",
        oneliner: "카드 패 정렬처럼 정렬된 앞부분에 원소를 끼워 넣는 방식. 거의 정렬된 데이터에서 최강",
        complexity: "최선 O(n) / 평균·최악 O(n²) / 공간 O(1) / 안정 정렬",
        detail: [
          "i번째 원소를 0~i-1 범위의 적절한 위치에 삽입하며 진행",
          "장점: 거의 정렬된 배열에서 O(n)에 근접. 안정 정렬. 온라인 알고리즘(스트림 가능)",
          "단점: 역순 정렬 입력에서 O(n²) 최악. 대규모 데이터엔 부적합",
          "사용 시점: 소규모(n<50), 거의 정렬된 데이터, 하이브리드 정렬의 베이스 케이스",
          "실무에서 Tim Sort, Intro Sort 등 하이브리드 정렬의 소구간 정렬에 삽입 정렬 사용",
          "최적화: 이진 탐색으로 삽입 위치를 O(log n)에 찾음 → 비교 O(n log n), 이동은 여전히 O(n²)",
          "면접 포인트: 비교 횟수는 줄어도 이동 횟수가 O(n²)임을 정확히 설명",
          "코테 실수: 반복 조건에서 j>=0 경계 체크 누락",
        ],
        csharp:
          "void InsertionSort(int[] a) {\n    for (int i = 1; i < a.Length; i++) {\n        int key = a[i], j = i - 1;\n        while (j >= 0 && a[j] > key) {\n            a[j + 1] = a[j];\n            j--;\n        }\n        a[j + 1] = key;\n    }\n}\n\n// 최적화: 이진 삽입 정렬 (비교 횟수 O(n log n))\nvoid BinaryInsertionSort(int[] a) {\n    for (int i = 1; i < a.Length; i++) {\n        int key = a[i];\n        int lo = 0, hi = i;\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (a[mid] <= key) lo = mid + 1;\n            else hi = mid;\n        }\n        for (int j = i; j > lo; j--) a[j] = a[j - 1];\n        a[lo] = key;\n    }\n}",
      },
      {
        term: "퀵 정렬 (Quick Sort)",
        oneliner: "피벗 기준 분할 후 재귀. 평균 O(n log n)이며 캐시 친화적으로 실무에서 가장 빠름",
        complexity: "최선·평균 O(n log n) / 최악 O(n²) / 공간 O(log n) / 불안정 정렬",
        detail: [
          "피벗을 선택해 작은 원소는 왼쪽, 큰 원소는 오른쪽으로 분할 후 재귀",
          "장점: 평균적으로 가장 빠름. 캐시 지역성이 좋아 상수 계수가 작음. in-place",
          "단점: 최악(이미 정렬/역순)에서 O(n²). 불안정 정렬",
          "사용 시점: 일반 범용 정렬. C#의 Array.Sort도 내부적으로 IntroSort(Quick+Heap+Insertion 혼합)",
          "최적화1: 피벗을 랜덤 선택하거나 Median-of-3으로 최악 확률을 크게 줄임",
          "최적화2: 소구간(n<10)에서 삽입 정렬로 전환 → 재귀 오버헤드 제거",
          "최적화3: 3-way 파티션(Dutch National Flag)으로 중복 원소가 많을 때 O(n)으로 수렴",
          "코테 실수: 피벗 선택을 항상 맨 앞으로 고정하면 정렬된 입력에서 O(n²)",
        ],
        csharp:
          "void QuickSort(int[] a, int lo, int hi) {\n    if (lo >= hi) return;\n    if (hi - lo < 10) { InsertionSortRange(a, lo, hi); return; }\n\n    int pivot = Partition(a, lo, hi);\n    QuickSort(a, lo, pivot - 1);\n    QuickSort(a, pivot + 1, hi);\n}\n\nint Partition(int[] a, int lo, int hi) {\n    // Median-of-3\n    int mid = lo + (hi - lo) / 2;\n    if (a[lo] > a[mid]) (a[lo], a[mid]) = (a[mid], a[lo]);\n    if (a[lo] > a[hi]) (a[lo], a[hi]) = (a[hi], a[lo]);\n    if (a[mid] > a[hi]) (a[mid], a[hi]) = (a[hi], a[mid]);\n    (a[mid], a[hi - 1]) = (a[hi - 1], a[mid]);\n    int pivot = a[hi - 1], i = lo, j = hi - 1;\n    while (true) {\n        while (a[++i] < pivot) {}\n        while (a[--j] > pivot) {}\n        if (i >= j) break;\n        (a[i], a[j]) = (a[j], a[i]);\n    }\n    (a[i], a[hi - 1]) = (a[hi - 1], a[i]);\n    return i;\n}\n\n// 최적화: 3-way 파티션 (중복 원소 많을 때)\nvoid QuickSort3Way(int[] a, int lo, int hi) {\n    if (lo >= hi) return;\n    int lt = lo, gt = hi, i = lo + 1, pivot = a[lo];\n    while (i <= gt) {\n        if      (a[i] < pivot) (a[lt++], a[i++]) = (a[i], a[lt]);\n        else if (a[i] > pivot) (a[i], a[gt--]) = (a[gt], a[i]);\n        else                   i++;\n    }\n    QuickSort3Way(a, lo, lt - 1);\n    QuickSort3Way(a, gt + 1, hi);\n}\n\nvoid InsertionSortRange(int[] a, int lo, int hi) {\n    for (int i = lo + 1; i <= hi; i++) {\n        int key = a[i], j = i - 1;\n        while (j >= lo && a[j] > key) { a[j + 1] = a[j]; j--; }\n        a[j + 1] = key;\n    }\n}",
      },
      {
        term: "병합 정렬 (Merge Sort)",
        oneliner: "분할 후 병합으로 항상 O(n log n) 보장. 안정 정렬이 필요하거나 외부 정렬에 필수",
        complexity: "최선·평균·최악 모두 O(n log n) / 공간 O(n) / 안정 정렬",
        detail: [
          "절반으로 분할 → 각각 재귀 정렬 → 두 정렬된 배열 병합",
          "장점: 최악에도 O(n log n) 보장. 안정 정렬. 연결 리스트 정렬에 최적",
          "단점: 추가 메모리 O(n) 필요. 캐시 비친화적(퀵 정렬보다 상수 계수 큼)",
          "사용 시점: 안정 정렬 필요, 최악 복잡도 보장 필요, 연결 리스트, 외부 정렬(디스크)",
          "최적화1: 소구간에서 삽입 정렬로 전환 (Tim Sort 방식)",
          "최적화2: bottom-up 방식으로 재귀 오버헤드 제거. 스택 오버플로우 위험도 없음",
          "최적화3: 두 부분 배열이 이미 정렬된 경우(a[mid] <= a[mid+1]) 병합 스킵",
          "면접 포인트: 왜 외부 정렬에 병합 정렬이 쓰이는지(순차 접근 패턴) 설명",
        ],
        csharp:
          "void MergeSort(int[] a, int lo, int hi, int[] tmp) {\n    if (lo >= hi) return;\n    if (hi - lo < 8) { InsertionSortRange(a, lo, hi); return; }\n    int mid = lo + (hi - lo) / 2;\n    MergeSort(a, lo, mid, tmp);\n    MergeSort(a, mid + 1, hi, tmp);\n    if (a[mid] <= a[mid + 1]) return; // 이미 정렬\n    Merge(a, lo, mid, hi, tmp);\n}\n\nvoid Merge(int[] a, int lo, int mid, int hi, int[] tmp) {\n    for (int k = lo; k <= hi; k++) tmp[k] = a[k];\n    int i = lo, j = mid + 1;\n    for (int k = lo; k <= hi; k++) {\n        if      (i > mid)         a[k] = tmp[j++];\n        else if (j > hi)          a[k] = tmp[i++];\n        else if (tmp[j] < tmp[i]) a[k] = tmp[j++];\n        else                      a[k] = tmp[i++];\n    }\n}\n\n// 최적화: 바텀업 병합 정렬 (재귀 없음)\nvoid MergeSortBottomUp(int[] a) {\n    int n = a.Length;\n    int[] tmp = new int[n];\n    for (int size = 1; size < n; size *= 2)\n        for (int lo = 0; lo < n - size; lo += size * 2) {\n            int mid = lo + size - 1;\n            int hi = Math.Min(lo + size * 2 - 1, n - 1);\n            if (a[mid] > a[mid + 1]) Merge(a, lo, mid, hi, tmp);\n        }\n}\n\nvoid InsertionSortRange(int[] a, int lo, int hi) {\n    for (int i = lo + 1; i <= hi; i++) {\n        int key = a[i], j = i - 1;\n        while (j >= lo && a[j] > key) { a[j + 1] = a[j]; j--; }\n        a[j + 1] = key;\n    }\n}",
      },
      {
        term: "힙 정렬 (Heap Sort)",
        oneliner: "최대 힙으로 최댓값을 반복 추출. 최악도 O(n log n)이며 추가 메모리 없음",
        complexity: "최선·평균·최악 모두 O(n log n) / 공간 O(1) / 불안정 정렬",
        detail: [
          "1단계: 배열을 최대 힙으로 heapify(O(n)). 2단계: 루트(최댓값)를 끝과 교환 후 heap 크기 축소 반복",
          "장점: 최악 O(n log n) 보장. 추가 메모리 O(1) (in-place). Quick+Merge 장점 조합",
          "단점: 캐시 비친화적(메모리 점프가 많음). 불안정 정렬. 상수 계수가 큼",
          "사용 시점: 메모리 제약 + 최악 복잡도 보장 둘 다 필요할 때. 우선순위 큐 구현",
          "IntroSort에서 재귀 깊이가 2*log(n)을 초과하면 힙 정렬로 전환",
          "최적화1: Floyd의 heapify(바텀업)로 초기 힙 구축을 O(n)에 수행",
          "최적화2: Bottom-up heap sort로 비교 횟수를 ~n log n 수준으로 감소",
          "면접 포인트: heapify가 왜 O(n)인지(리프 노드는 비교 불필요) 설명",
        ],
        csharp:
          "void HeapSort(int[] a) {\n    int n = a.Length;\n    // Floyd 바텀업 힙 구축 O(n)\n    for (int i = n / 2 - 1; i >= 0; i--) Heapify(a, n, i);\n    // 최댓값을 끝으로 보내며 축소\n    for (int i = n - 1; i > 0; i--) {\n        (a[0], a[i]) = (a[i], a[0]);\n        Heapify(a, i, 0);\n    }\n}\n\nvoid Heapify(int[] a, int n, int root) {\n    while (true) {\n        int largest = root, l = 2 * root + 1, r = 2 * root + 2;\n        if (l < n && a[l] > a[largest]) largest = l;\n        if (r < n && a[r] > a[largest]) largest = r;\n        if (largest == root) break;\n        (a[root], a[largest]) = (a[largest], a[root]);\n        root = largest;\n    }\n}",
      },
      {
        term: "셸 정렬 (Shell Sort)",
        oneliner: "삽입 정렬을 간격(gap) 단위로 확장. 단순 삽입 정렬보다 훨씬 빠른 준선형 성능",
        complexity: "간격 수열에 따라 O(n^1.3) ~ O(n^1.5) / 공간 O(1) / 불안정 정렬",
        detail: [
          "큰 gap으로 시작해 점차 줄여나가며 gap=1일 때 일반 삽입 정렬로 마무리",
          "장점: 구현 단순. 추가 메모리 없음. O(n²) 삽입 정렬보다 실제로 훨씬 빠름",
          "단점: 최적 간격 수열이 이론적으로 확정되지 않음. 불안정 정렬",
          "사용 시점: 중간 규모(n~10^4), 메모리 제약이 있고 병합/퀵보다 단순한 구현을 원할 때",
          "간격 수열에 따라 성능이 크게 다름: Hibbard O(n^1.5), Sedgewick ~O(n^4/3), Ciura 경험적 최적",
          "최적화: Ciura 수열(1,4,10,23,57,132,301,701,1750...)이 현실적으로 가장 좋은 성능",
          "면접 포인트: 왜 단순 삽입보다 빠른지(큰 gap이 장거리 역전을 미리 해소) 설명",
          "코테 실수: gap을 2로 나누는 단순 수열을 쓰면 성능이 크게 저하됨",
        ],
        csharp:
          "// 기본 Shell Sort (gap /= 2)\nvoid ShellSort(int[] a) {\n    int n = a.Length;\n    for (int gap = n / 2; gap > 0; gap /= 2)\n        for (int i = gap; i < n; i++) {\n            int key = a[i], j = i;\n            while (j >= gap && a[j - gap] > key) { a[j] = a[j - gap]; j -= gap; }\n            a[j] = key;\n        }\n}\n\n// 최적화: Ciura 간격 수열\nvoid ShellSortCiura(int[] a) {\n    int[] gaps = { 1750, 701, 301, 132, 57, 23, 10, 4, 1 };\n    int n = a.Length;\n    foreach (int gap in gaps) {\n        if (gap >= n) continue;\n        for (int i = gap; i < n; i++) {\n            int key = a[i], j = i;\n            while (j >= gap && a[j - gap] > key) { a[j] = a[j - gap]; j -= gap; }\n            a[j] = key;\n        }\n    }\n}",
      },
      {
        term: "계수 정렬 (Counting Sort)",
        oneliner: "비교 없이 빈도를 세어 배치. 값 범위 k가 작으면 O(n+k)로 비교 정렬 한계 돌파",
        complexity: "시간 O(n+k) / 공간 O(n+k) / 안정 정렬 (구현에 따라)",
        detail: [
          "각 값의 출현 횟수를 count 배열에 기록 → 누적합 → 역순으로 결과 배열에 배치",
          "장점: 비교 정렬 하한 O(n log n)을 우회. k가 작으면 O(n)에 근접. 안정 정렬 가능",
          "단점: 값 범위 k가 크면 메모리 낭비(k=10^9이면 불가). 정수/이산 값만 가능",
          "사용 시점: 값 범위가 좁은 정수 배열(나이, 점수 0~100, 알파벳 빈도 등)",
          "안정 정렬 구현: 누적합으로 각 값의 끝 위치를 계산 후 역순 배치",
          "최적화: 최솟값을 offset으로 활용해 count 배열 크기를 max-min+1로 축소",
          "기수 정렬의 서브루틴으로 사용 시 안정성이 핵심 요건",
          "코테 실수: 음수 처리 누락(offset 없이 음수 인덱스 접근), count 배열 초기화 누락",
        ],
        csharp:
          "// 기본 계수 정렬\nint[] CountingSort(int[] a, int maxVal) {\n    int[] cnt = new int[maxVal + 1];\n    foreach (int x in a) cnt[x]++;\n    int[] out_ = new int[a.Length], idx = { 0 };\n    for (int v = 0; v <= maxVal; v++)\n        while (cnt[v]-- > 0) out_[idx[0]++] = v;\n    return out_;\n}\n\n// 최적화: 안정 정렬 + 음수/offset 처리\nint[] CountingSortStable(int[] a) {\n    if (a.Length == 0) return a;\n    int min = a[0], max = a[0];\n    foreach (int x in a) { if (x < min) min = x; if (x > max) max = x; }\n    int k = max - min + 1;\n    int[] cnt = new int[k];\n    foreach (int x in a) cnt[x - min]++;\n    for (int i = 1; i < k; i++) cnt[i] += cnt[i - 1]; // 누적합\n    int[] out_ = new int[a.Length];\n    for (int i = a.Length - 1; i >= 0; i--) // 역순으로 안정성 보장\n        out_[--cnt[a[i] - min]] = a[i];\n    return out_;\n}",
      },
      {
        term: "기수 정렬 (Radix Sort)",
        oneliner: "자릿수별 안정 정렬 반복으로 O(d(n+k)) 달성. 큰 범위 정수도 효율적으로 처리",
        complexity: "시간 O(d(n+k)) / 공간 O(n+k) / 안정 정렬",
        detail: [
          "LSD(최하위 자리부터): 각 자릿수에 대해 안정 정렬 반복. 일반적으로 LSD 사용",
          "MSD(최상위 자리부터): 재귀 분할. 문자열 정렬에 유리",
          "장점: 자릿수 d가 작으면 O(n)에 근접. 넓은 범위 정수도 효율적으로 처리",
          "단점: 자릿수 기준 분리가 가능한 데이터만 적용 가능. 구현 복잡",
          "사용 시점: 고정 길이 키(IP, 날짜, 전화번호), int 범위 정수 대량 정렬",
          "최적화1: 기수(radix)를 256(1바이트)으로 설정하면 int32는 4패스로 완료",
          "최적화2: 각 패스에서 이미 정렬된 자리는 스킵하는 얼리 터미네이션",
          "면접 포인트: 왜 각 패스 정렬이 안정적이어야 하는지(이전 자릿수 순서 유지)",
        ],
        csharp:
          "// LSD Radix Sort (base-10, 양수 정수)\nvoid RadixSort(int[] a) {\n    int max = a.Max();\n    int[] tmp = new int[a.Length];\n    for (int exp = 1; max / exp > 0; exp *= 10)\n        CountByDigit(a, tmp, exp);\n}\n\nvoid CountByDigit(int[] a, int[] out_, int exp) {\n    int n = a.Length;\n    int[] cnt = new int[10];\n    foreach (int x in a) cnt[(x / exp) % 10]++;\n    for (int i = 1; i < 10; i++) cnt[i] += cnt[i - 1];\n    for (int i = n - 1; i >= 0; i--) out_[--cnt[(a[i] / exp) % 10]] = a[i];\n    Array.Copy(out_, a, n);\n}\n\n// 최적화: base-256 (4패스로 int32 완료)\nvoid RadixSort256(int[] a) {\n    int n = a.Length;\n    int[] tmp = new int[n];\n    for (int shift = 0; shift < 32; shift += 8) {\n        int[] cnt = new int[256];\n        foreach (int x in a) cnt[(x >> shift) & 0xFF]++;\n        for (int i = 1; i < 256; i++) cnt[i] += cnt[i - 1];\n        for (int i = n - 1; i >= 0; i--) tmp[--cnt[(a[i] >> shift) & 0xFF]] = a[i];\n        (a, tmp) = (tmp, a);\n    }\n}",
      },
      {
        term: "팀 정렬 (Tim Sort)",
        oneliner: "병합+삽입 정렬 하이브리드. Python/Java 표준 라이브러리 정렬 알고리즘",
        complexity: "최선 O(n) / 평균·최악 O(n log n) / 공간 O(n) / 안정 정렬",
        detail: [
          "자연적으로 정렬된 부분(run)을 탐지하고 병합하는 실용 최강 정렬",
          "1단계: 배열을 minRun(32~64) 크기의 run으로 나누고 삽입 정렬로 정렬",
          "2단계: 스택에 run을 쌓으며 특정 조건(Galloping 조건) 만족 시 병합",
          "장점: 실제 데이터(부분 정렬, 역순 구간 혼재)에서 압도적 성능. 안정 정렬",
          "단점: 구현 복잡도가 높음. 코테에서 직접 구현하는 경우는 거의 없음",
          "사용 시점: Python sort(), Java Arrays.sort(객체), Java Collections.sort의 내부 구현",
          "C#의 Array.Sort는 IntroSort(Quick+Heap+Insertion). Tim Sort 사용 시 직접 구현 필요",
          "면접 포인트: 왜 Tim Sort가 실제 데이터에서 좋은지(자연 run 활용) 개념 설명",
        ],
        csharp:
          "const int MIN_RUN = 32;\n\nvoid TimSort(int[] a) {\n    int n = a.Length;\n    // 1단계: run마다 삽입 정렬\n    for (int i = 0; i < n; i += MIN_RUN) {\n        int hi = Math.Min(i + MIN_RUN - 1, n - 1);\n        InsertionSortRange(a, i, hi);\n    }\n    // 2단계: run을 병합하며 크기를 2배씩 확장\n    int[] tmp = new int[n];\n    for (int size = MIN_RUN; size < n; size *= 2)\n        for (int lo = 0; lo < n; lo += 2 * size) {\n            int mid = Math.Min(lo + size - 1, n - 1);\n            int hi = Math.Min(lo + 2 * size - 1, n - 1);\n            if (mid < hi) Merge(a, lo, mid, hi, tmp);\n        }\n}\n\nvoid InsertionSortRange(int[] a, int lo, int hi) {\n    for (int i = lo + 1; i <= hi; i++) {\n        int key = a[i], j = i - 1;\n        while (j >= lo && a[j] > key) { a[j + 1] = a[j]; j--; }\n        a[j + 1] = key;\n    }\n}\n\nvoid Merge(int[] a, int lo, int mid, int hi, int[] tmp) {\n    for (int k = lo; k <= hi; k++) tmp[k] = a[k];\n    int i = lo, j = mid + 1;\n    for (int k = lo; k <= hi; k++) {\n        if      (i > mid)         a[k] = tmp[j++];\n        else if (j > hi)          a[k] = tmp[i++];\n        else if (tmp[j] < tmp[i]) a[k] = tmp[j++];\n        else                      a[k] = tmp[i++];\n    }\n}",
      },
      {
        term: "트리 정렬 (Tree Sort)",
        oneliner: "BST에 원소를 삽입 후 중위 순회로 정렬. 균형 트리 사용 시 O(n log n) 보장",
        complexity: "평균 O(n log n) / 최악(편향 BST) O(n²) / 공간 O(n) / 안정 정렬 가능",
        detail: [
          "일반 BST: 삽입 O(log n) 평균, 중위 순회 O(n) → 전체 O(n log n) 평균",
          "최악: 정렬/역순 입력에서 편향 트리가 되어 O(n²). AVL/Red-Black 사용으로 방지",
          "장점: 삽입/삭제가 빈번한 온라인 시나리오에서 자연스럽게 정렬 유지 가능",
          "단점: 추가 메모리 O(n). 포인터 기반으로 캐시 비친화적. 편향 위험",
          "사용 시점: 동적으로 원소가 추가되면서 항상 정렬 상태를 유지해야 할 때",
          "C#에서는 SortedSet<T>, SortedDictionary<K,V>가 Red-Black Tree 기반으로 자동 정렬 유지",
          "최적화: AVL 또는 Red-Black Tree로 균형을 보장해 최악 O(n²)를 O(n log n)으로 보장",
          "면접 포인트: 트리 정렬 vs 힙 정렬 — 둘 다 트리 기반이나 힙은 in-place로 메모리 우위",
        ],
        csharp:
          "// C# SortedSet 활용 (Red-Black Tree, 중복 제거)\nvoid TreeSortDistinct(int[] a) {\n    var tree = new SortedSet<int>(a);\n    int i = 0;\n    foreach (int x in tree) a[i++] = x;\n}\n\n// 중복 포함 트리 정렬: SortedDictionary로 빈도 관리\nint[] TreeSortWithDuplicates(int[] a) {\n    var freq = new SortedDictionary<int, int>();\n    foreach (int x in a) freq[x] = freq.GetValueOrDefault(x) + 1;\n    int[] result = new int[a.Length];\n    int idx = 0;\n    foreach (var (val, cnt) in freq)\n        for (int i = 0; i < cnt; i++) result[idx++] = val;\n    return result;\n}\n\n// 직접 BST 구현 (학습용)\nclass BstNode { public int Val; public BstNode L, R; }\n\nBstNode Insert(BstNode node, int val) {\n    if (node == null) return new BstNode { Val = val };\n    if (val < node.Val) node.L = Insert(node.L, val);\n    else node.R = Insert(node.R, val);\n    return node;\n}\n\nvoid InOrder(BstNode node, List<int> result) {\n    if (node == null) return;\n    InOrder(node.L, result);\n    result.Add(node.Val);\n    InOrder(node.R, result);\n}",
      },
    ],
  },
];
