export type DSItem = {
  term: string;
  oneliner: string;
  detail: string[];
  complexity?: string;
  csharp?: string;
};

export type DSSection = {
  id: string;
  title: string;
  color: "yellow" | "red" | "white";
  items: DSItem[];
};

export const dsSections: DSSection[] = [
  // ── 1. 배열 / 문자열 ──────────────────────────────────────
  {
    id: "array-ds",
    title: "배열 / 문자열",
    color: "yellow",
    items: [
      {
        term: "1차원 배열",
        oneliner: "연속 메모리 블록. 인덱스 접근 O(1), 삽입/삭제 O(n)",
        complexity: "접근 O(1) / 탐색 O(n) / 삽입·삭제 O(n) / 공간 O(n)",
        detail: [
          "핵심 개념: 동일 타입 원소를 메모리 연속 공간에 저장. 인덱스로 즉시 접근 가능",
          "시간 복잡도: 인덱스 접근 O(1), 선형 탐색 O(n), 중간 삽입·삭제 O(n) (이후 원소 시프트)",
          "공간 복잡도: O(n). C#에서 int[] 선언 시 0으로 자동 초기화",
          "C# 사용법: int[] arr = new int[n]; / int[] arr = {1,2,3}; / Array.Sort(arr); / Array.Reverse(arr);",
          "2차원 배열: int[,] grid = new int[rows, cols]; 행우선(row-major) 저장. grid[r,c]로 접근",
          "코딩테스트 적용: 인덱스가 중요한 문제, 정렬 후 이진 탐색, prefix sum 계산에 핵심",
          "면접 포인트: 배열이 캐시 친화적인 이유(메모리 연속성 = 캐시 히트율↑) 설명 필수",
          "흔한 실수: 인덱스 범위 초과(IndexOutOfRangeException), 2D 배열에서 행/열 혼동",
          "List<T>와 비교: 배열은 크기 고정, List<T>는 동적 확장(내부적으로 배열 2배 재할당)",
          "주의: 배열은 참조 타입이므로 int[] b = a; 는 복사가 아닌 참조 공유. (int[])a.Clone() 필요",
        ],
        csharp:
          "int[] arr = new int[5];\nint[,] grid = new int[3, 4];\n\n// 1D prefix sum\nint n = arr.Length;\nint[] prefix = new int[n + 1];\nfor (int i = 0; i < n; i++)\n    prefix[i + 1] = prefix[i] + arr[i];\n// 구간 [l, r] 합: prefix[r+1] - prefix[l]\n\n// 2D 배열 BFS 방향 벡터\nint[] dr = { -1, 1, 0, 0 };\nint[] dc = { 0, 0, -1, 1 };\nfor (int d = 0; d < 4; d++) {\n    int nr = r + dr[d], nc = c + dc[d];\n    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols)\n        // 방문 처리\n        visited[nr, nc] = true;\n}\n\n// 배열 복사\nint[] copy = (int[])arr.Clone();\nArray.Copy(arr, copy, arr.Length);",
      },
      {
        term: "슬라이딩 윈도우",
        oneliner: "부분 배열/구간을 O(n)으로 탐색하는 기법. 투 포인터의 특수 형태",
        complexity: "시간 O(n) / 공간 O(1) ~ O(k)",
        detail: [
          "핵심 개념: 고정 또는 가변 크기의 윈도우를 오른쪽으로 슬라이드하며 구간 정보를 유지",
          "고정 윈도우: 크기 k 유지. 진입 원소 추가, 진출 원소 제거 → 매 이동 O(1)",
          "가변 윈도우: 조건 만족할 때까지 right 확장, 위반 시 left 축소 (투 포인터 패턴)",
          "시간 복잡도: O(n). 이중 루프 O(n²) 풀이를 선형으로 최적화할 때 핵심 기법",
          "C# 사용법: int left=0, right=0; 포인터 두 개와 현재 상태 변수(sum, count 등) 관리",
          "코딩테스트 적용: '연속 부분배열 최대합', '길이 k 구간 최댓값', '조건 만족 최소 길이 구간'",
          "면접 포인트: 왜 O(n)인지 설명 — left, right 각각 최대 n번 이동하므로 총 2n = O(n)",
          "흔한 실수: 가변 윈도우에서 left > right 상태 진입, 윈도우 상태 갱신 순서 착오",
          "덱(Deque)과 결합: 슬라이딩 윈도우 최댓값 문제는 단조 덱으로 O(n) 구현",
          "배열 vs 문자열: 둘 다 동일한 슬라이딩 윈도우 적용 가능. 문자열에서는 Dictionary로 빈도 관리",
        ],
        csharp:
          "// 고정 크기 k 윈도우 최대합\nint MaxSumWindow(int[] arr, int k) {\n    int sum = 0, maxSum = 0;\n    for (int i = 0; i < k; i++) sum += arr[i];\n    maxSum = sum;\n    for (int i = k; i < arr.Length; i++) {\n        sum += arr[i] - arr[i - k];\n        maxSum = Math.Max(maxSum, sum);\n    }\n    return maxSum;\n}\n\n// 가변 윈도우: 합이 target 이하인 가장 긴 구간\nint LongestSubarray(int[] arr, int target) {\n    int left = 0, sum = 0, best = 0;\n    for (int right = 0; right < arr.Length; right++) {\n        sum += arr[right];\n        while (sum > target && left <= right) {\n            sum -= arr[left++];\n        }\n        best = Math.Max(best, right - left + 1);\n    }\n    return best;\n}\n\n// 슬라이딩 윈도우 + 해시: 애너그램 탐색\nbool ContainsAnagram(string s, string p) {\n    var freq = new int[26];\n    foreach (char c in p) freq[c - 'a']++;\n    int match = freq.Count(x => x > 0);\n    int have = 0;\n    var window = new int[26];\n    for (int r = 0; r < s.Length; r++) {\n        int ci = s[r] - 'a';\n        window[ci]++;\n        if (window[ci] == freq[ci]) have++;\n        if (r >= p.Length) {\n            int li = s[r - p.Length] - 'a';\n            if (window[li] == freq[li]) have--;\n            window[li]--;\n        }\n        if (have == match) return true;\n    }\n    return false;\n}",
      },
      {
        term: "이진 탐색 (Binary Search)",
        oneliner: "정렬된 배열에서 O(log n) 탐색. 범위를 절반씩 좁힘",
        complexity: "탐색 O(log n) / 공간 O(1)",
        detail: [
          "핵심 개념: 정렬된 배열에서 mid를 기준으로 탐색 범위를 절반으로 줄여나감",
          "시간 복잡도: O(log n). n=10억 이어도 30번 미만 비교로 탐색 완료",
          "C# 내장: Array.BinarySearch(arr, val) — 찾으면 인덱스, 없으면 ~(삽입위치) 반환",
          "코딩테스트 적용: '정렬된 배열에서 특정 값', '파라메트릭 서치(최솟값 중 최대 등)', '경계 탐색'",
          "파라메트릭 서치: '조건 f(x)=true 인 최소/최대 x 찾기'. 단조 함수라면 이진 탐색 적용",
          "Lower Bound: 같거나 큰 첫 번째 위치 / Upper Bound: 초과하는 첫 번째 위치 구현 패턴 암기 필수",
          "면접 포인트: while 조건 left<=right vs left<right 차이, mid 오버플로우 방지 (mid = left + (right-left)/2)",
          "흔한 실수: int mid = (left+right)/2 → left+right가 int 범위 초과. C#에서는 unchecked로 오버플로우 발생",
          "배열이 정렬 안 된 경우: 먼저 Sort(O(n log n)) 후 이진 탐색 — O(n log n) 전처리 비용 고려",
          "SortedSet<T>, SortedList<K,V>: 이진 탐색 트리 기반. GetViewBetween, BinarySearch 활용 가능",
        ],
        csharp:
          "// 기본 이진 탐색 (직접 구현)\nint BinarySearch(int[] arr, int target) {\n    int left = 0, right = arr.Length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\n// Lower Bound: target 이상의 첫 번째 인덱스\nint LowerBound(int[] arr, int target) {\n    int left = 0, right = arr.Length;\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid;\n    }\n    return left;\n}\n\n// 파라메트릭 서치: 배열을 k개 묶음으로 나눌 때 최대 묶음 합의 최솟값\nint Parametric(int[] arr, int k) {\n    int left = arr.Max(), right = arr.Sum();\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        int groups = 1, cur = 0;\n        foreach (int x in arr) {\n            if (cur + x > mid) { groups++; cur = 0; }\n            cur += x;\n        }\n        if (groups <= k) right = mid;\n        else left = mid + 1;\n    }\n    return left;\n}",
      },
      {
        term: "투 포인터 (Two Pointers)",
        oneliner: "좌우 포인터로 O(n)에 쌍 탐색. 정렬된 배열이나 구간 문제에 필수",
        complexity: "시간 O(n) / 공간 O(1)",
        detail: [
          "핵심 개념: 두 포인터를 양 끝(또는 같은 방향)에서 시작해 조건에 따라 이동",
          "양방향 패턴: left=0, right=n-1. 합이 target보다 크면 right--, 작으면 left++",
          "같은 방향 패턴: slow/fast 포인터. 중복 제거, 사이클 감지 등에 활용",
          "시간 복잡도: left, right 각각 최대 n번 이동 → 총 O(n). 정렬 전처리 포함 시 O(n log n)",
          "C# 사용법: int l=0, r=arr.Length-1; while(l<r) { ... }",
          "코딩테스트 적용: '두 수의 합', '세 수의 합', '가장 가까운 쌍', '팰린드롬 판별'",
          "면접 포인트: 투 포인터가 O(n)인 이유, 정렬이 필요한 이유, 슬라이딩 윈도우와 차이",
          "슬라이딩 윈도우 vs 투 포인터: 윈도우는 구간 자체를 다루고, 투 포인터는 쌍(pair)을 다룸",
          "흔한 실수: 정렬 없이 투 포인터 적용(잘못된 결과), left==right 시 무한 루프",
          "확장: 세 수의 합은 한 값 고정 후 나머지 두 값에 투 포인터 적용 → O(n²)",
        ],
        csharp:
          "// 정렬된 배열에서 합이 target인 쌍 탐색\nbool TwoSum(int[] arr, int target) {\n    Array.Sort(arr);\n    int l = 0, r = arr.Length - 1;\n    while (l < r) {\n        int sum = arr[l] + arr[r];\n        if (sum == target) return true;\n        else if (sum < target) l++;\n        else r--;\n    }\n    return false;\n}\n\n// 세 수의 합이 0인 모든 조합\nIList<IList<int>> ThreeSum(int[] nums) {\n    Array.Sort(nums);\n    var result = new List<IList<int>>();\n    for (int i = 0; i < nums.Length - 2; i++) {\n        if (i > 0 && nums[i] == nums[i-1]) continue;\n        int l = i + 1, r = nums.Length - 1;\n        while (l < r) {\n            int s = nums[i] + nums[l] + nums[r];\n            if (s == 0) {\n                result.Add(new List<int>{nums[i], nums[l], nums[r]});\n                while (l < r && nums[l] == nums[l+1]) l++;\n                while (l < r && nums[r] == nums[r-1]) r--;\n                l++; r--;\n            } else if (s < 0) l++;\n            else r--;\n        }\n    }\n    return result;\n}",
      },
      {
        term: "Prefix Sum (누적 합)",
        oneliner: "전처리로 O(1) 구간 합 쿼리 가능. DP의 기초 패턴",
        complexity: "전처리 O(n) / 쿼리 O(1) / 공간 O(n)",
        detail: [
          "핵심 개념: prefix[i] = arr[0]+...+arr[i-1] 을 미리 계산. 구간 [l,r] 합 = prefix[r+1]-prefix[l]",
          "시간 복잡도: 전처리 O(n), 쿼리 O(1). 쿼리가 Q개라면 naive O(nQ) → O(n+Q)",
          "2D prefix sum: grid[i][j]의 사각형 영역 합을 O(1)로 계산. 이미지 처리, 행렬 합 문제에 활용",
          "C# 사용법: int[] prefix = new int[n+1]; prefix[i+1] = prefix[i] + arr[i];",
          "코딩테스트 적용: '구간 합 반복 쿼리', '부분 배열 합이 k인 경우 수 세기', '2D 영역 합'",
          "HashMap과 결합: prefix[j]-prefix[i]==k 이면 arr[i..j-1] 합이 k. 해시맵에 prefix 저장하여 O(n) 탐색",
          "면접 포인트: prefix sum과 difference array의 차이 설명. difference array는 구간 업데이트 O(1)에 활용",
          "흔한 실수: prefix 배열 크기를 n 대신 n+1로 설정 안 함 → 범위 초과",
          "차이 배열(Difference Array): diff[l]++, diff[r+1]-- 후 prefix 복원으로 구간 업데이트 O(1) 가능",
          "Fenwick Tree / 세그먼트 트리: prefix sum의 고급 버전. 업데이트도 O(log n)으로 처리",
        ],
        csharp:
          "// 1D Prefix Sum\nint[] arr = { 1, 2, 3, 4, 5 };\nint n = arr.Length;\nint[] prefix = new int[n + 1];\nfor (int i = 0; i < n; i++)\n    prefix[i + 1] = prefix[i] + arr[i];\n// [1, 3] 구간 합 = prefix[4] - prefix[1] = 10 - 1 = 9\n\n// 합이 k인 부분 배열 개수 (해시맵 결합)\nint SubarraySum(int[] nums, int k) {\n    var map = new Dictionary<int, int> { [0] = 1 };\n    int count = 0, sum = 0;\n    foreach (int x in nums) {\n        sum += x;\n        if (map.TryGetValue(sum - k, out int v)) count += v;\n        map[sum] = map.GetValueOrDefault(sum) + 1;\n    }\n    return count;\n}\n\n// 2D Prefix Sum\nint[,] Preprocess2D(int[,] grid, int R, int C) {\n    int[,] p = new int[R + 1, C + 1];\n    for (int r = 1; r <= R; r++)\n        for (int c = 1; c <= C; c++)\n            p[r, c] = grid[r-1, c-1] + p[r-1, c] + p[r, c-1] - p[r-1, c-1];\n    return p;\n}",
      },
    ],
  },

  // ── 2. 연결 리스트 ────────────────────────────────────────
  {
    id: "linkedlist-ds",
    title: "연결 리스트",
    color: "white",
    items: [
      {
        term: "단일 연결 리스트 (Singly Linked List)",
        oneliner: "각 노드가 다음 노드만 참조. 삽입/삭제 O(1) (위치 알 때), 탐색 O(n)",
        complexity: "탐색 O(n) / 앞 삽입·삭제 O(1) / 임의 삽입·삭제 O(n) / 공간 O(n)",
        detail: [
          "핵심 개념: 노드(데이터+next 포인터)를 체인처럼 연결. 배열과 달리 메모리 비연속",
          "시간 복잡도: 임의 탐색 O(n), 헤드 삽입/삭제 O(1), 특정 위치 삽입/삭제 O(n) — 탐색 포함",
          "공간 복잡도: O(n). 각 노드에 포인터 저장 공간 추가 오버헤드 발생",
          "C#: LinkedList<T> 클래스 제공. AddFirst, AddLast, AddBefore, AddAfter, Remove, Find 메서드",
          "코딩테스트: 직접 노드 클래스 구현 후 조작하는 문제가 대부분 (LeetCode 스타일)",
          "더미 헤드(Sentinel Node) 패턴: head 앞에 더미 노드 추가 → 엣지 케이스(빈 리스트, 헤드 삭제) 통합 처리",
          "면접 포인트: 배열 대비 장단점, 캐시 미스 발생 이유, 역순 출력/역순 변환 구현",
          "흔한 실수: prev/curr/next 포인터 업데이트 순서 착오로 노드 유실, null 참조 예외",
          "배열 vs 연결리스트: 배열은 캐시 친화적·인덱스 O(1), 연결리스트는 삽입·삭제 유연·임의 접근 O(n)",
          "C# LinkedList<T>는 이중 연결 리스트. 단방향 연결리스트는 직접 구현 필요",
        ],
        csharp:
          "class ListNode {\n    public int Val;\n    public ListNode Next;\n    public ListNode(int val) { Val = val; }\n}\n\n// 더미 헤드 패턴으로 리스트 역순\nListNode Reverse(ListNode head) {\n    ListNode prev = null, curr = head;\n    while (curr != null) {\n        ListNode next = curr.Next;\n        curr.Next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}\n\n// 더미 헤드로 k번째 노드 삭제 (엣지케이스 통합)\nListNode RemoveNthFromEnd(ListNode head, int n) {\n    var dummy = new ListNode(0) { Next = head };\n    ListNode fast = dummy, slow = dummy;\n    for (int i = 0; i <= n; i++) fast = fast.Next;\n    while (fast != null) { fast = fast.Next; slow = slow.Next; }\n    slow.Next = slow.Next.Next;\n    return dummy.Next;\n}",
      },
      {
        term: "Floyd 사이클 감지 (토끼와 거북이)",
        oneliner: "slow/fast 포인터로 O(1) 공간에 사이클 탐지",
        complexity: "시간 O(n) / 공간 O(1)",
        detail: [
          "핵심 개념: slow는 1칸, fast는 2칸 이동. 사이클 있으면 반드시 만남(Floyd's theorem)",
          "사이클 감지: fast == null이면 사이클 없음. fast == slow이면 사이클 존재",
          "사이클 진입점 탐색: 만난 후 slow를 head로 리셋, fast 그대로. 둘 다 1칸씩 이동하면 진입점에서 만남",
          "시간 복잡도: O(n). 사이클 길이에 무관하게 선형 시간",
          "공간 복잡도: O(1). 해시셋으로 방문 기록하는 O(n) 풀이 대비 최적",
          "C# 적용: 연결리스트 사이클 문제, 배열 내 중복 탐지(배열을 연결리스트처럼 다룸)",
          "코딩테스트 적용: 'Linked List Cycle', 'Find the Duplicate Number', '중간 노드 탐색'",
          "중간 노드 탐색: fast가 끝에 도달할 때 slow가 중간에 위치 → 홀수 길이 고려",
          "면접 포인트: 왜 사이클 있으면 무조건 만나는지 수학적 증명 간략히 설명 가능해야 함",
          "흔한 실수: fast.Next == null 체크 전에 fast.Next.Next 접근 → NullReferenceException",
        ],
        csharp:
          "// 사이클 감지\nbool HasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.Next != null) {\n        slow = slow.Next;\n        fast = fast.Next.Next;\n        if (slow == fast) return true;\n    }\n    return false;\n}\n\n// 사이클 진입점 탐색\nListNode DetectCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.Next != null) {\n        slow = slow.Next;\n        fast = fast.Next.Next;\n        if (slow == fast) {\n            slow = head;\n            while (slow != fast) {\n                slow = slow.Next;\n                fast = fast.Next;\n            }\n            return slow; // 진입점\n        }\n    }\n    return null;\n}\n\n// 중간 노드 탐색\nListNode MiddleNode(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.Next != null) {\n        slow = slow.Next;\n        fast = fast.Next.Next;\n    }\n    return slow;\n}",
      },
      {
        term: "연결리스트 병합 / 분할",
        oneliner: "정렬된 두 리스트 병합 O(n+m), 분할 정복으로 Merge Sort 구현",
        complexity: "병합 O(n+m) / 병합정렬 O(n log n) / 공간 O(log n) 스택",
        detail: [
          "핵심 개념: 정렬된 두 리스트를 더미 헤드 + 포인터로 O(n+m) 병합",
          "더미 헤드 활용: 결과 리스트 head를 dummy로 시작 → 빈 리스트 처리 단순화",
          "K개 정렬 리스트 병합: 우선순위 큐(MinHeap)에 각 리스트 헤드 삽입 → O(n log k)",
          "연결리스트 병합 정렬: 중간 분할(Floyd) + 재귀 정렬 + 병합. O(n log n) 시간, O(log n) 스택 공간",
          "C# 적용: LinkedList<T>.AddBefore, AddAfter로 병합 가능하나 직접 노드 조작이 더 효율적",
          "코딩테스트 적용: 'Merge Two Sorted Lists', 'Merge k Sorted Lists', 'Sort List'",
          "면접 포인트: 배열 병합과 달리 추가 공간 없이 포인터만으로 O(1) 공간 병합 가능",
          "흔한 실수: 병합 후 나머지 리스트 연결 누락, 포인터 이동 전 next 저장 안 함",
          "우선순위 큐 K-way 병합: PriorityQueue<ListNode, int> 사용 → C# 내장 MinHeap 활용",
          "재귀 vs 반복: 재귀는 코드 간결하나 깊은 리스트에서 스택 오버플로우 위험",
        ],
        csharp:
          "// 정렬된 두 리스트 병합\nListNode MergeTwoLists(ListNode l1, ListNode l2) {\n    var dummy = new ListNode(0);\n    var cur = dummy;\n    while (l1 != null && l2 != null) {\n        if (l1.Val <= l2.Val) { cur.Next = l1; l1 = l1.Next; }\n        else { cur.Next = l2; l2 = l2.Next; }\n        cur = cur.Next;\n    }\n    cur.Next = l1 ?? l2;\n    return dummy.Next;\n}\n\n// K개 정렬 리스트 병합 (MinHeap)\nListNode MergeKLists(ListNode[] lists) {\n    var pq = new PriorityQueue<ListNode, int>();\n    foreach (var node in lists)\n        if (node != null) pq.Enqueue(node, node.Val);\n    var dummy = new ListNode(0);\n    var cur = dummy;\n    while (pq.Count > 0) {\n        var node = pq.Dequeue();\n        cur.Next = node;\n        cur = cur.Next;\n        if (node.Next != null) pq.Enqueue(node.Next, node.Next.Val);\n    }\n    return dummy.Next;\n}",
      },
    ],
  },

  // ── 3. 스택 / 큐 / 덱 ────────────────────────────────────
  {
    id: "stack-queue-ds",
    title: "스택 / 큐 / 덱",
    color: "red",
    items: [
      {
        term: "스택 (Stack)",
        oneliner: "LIFO. Push/Pop/Peek 모두 O(1). 재귀 → 반복 변환, 괄호 검사에 핵심",
        complexity: "Push O(1) / Pop O(1) / Peek O(1) / 공간 O(n)",
        detail: [
          "핵심 개념: Last In First Out. 가장 나중에 들어온 원소가 먼저 나옴",
          "C# 내장: Stack<T>. Push(val), Pop(), Peek(), Count, Contains() 제공",
          "시간 복잡도: Push, Pop, Peek 모두 O(1). 내부적으로 배열 기반으로 동적 확장",
          "재귀 → 반복 변환: 재귀 호출 스택을 명시적 Stack<T>로 대체하여 스택 오버플로우 방지",
          "코딩테스트 적용: 괄호 유효성 검사, 후위 표기식 계산, 히스토그램 최대 직사각형, 역순 출력",
          "단조 스택(Monotonic Stack): 스택에 단조 증가/감소 순서 유지. 'Next Greater Element' 패턴",
          "면접 포인트: 스택으로 큐 구현(입력스택+출력스택), 최솟값 O(1) 조회 스택(보조스택 사용)",
          "흔한 실수: Pop/Peek 전에 Count == 0 체크 안 함 → InvalidOperationException",
          "단조 스택 패턴: 오른쪽에서 처음으로 나보다 큰 값 찾기 → O(n²)을 O(n)으로 최적화",
          "배열로 구현: int[] stack = new int[n]; int top = -1; 로 직접 구현하면 오버헤드 최소화",
        ],
        csharp:
          "// 괄호 유효성 검사\nbool IsValid(string s) {\n    var stack = new Stack<char>();\n    foreach (char c in s) {\n        if (c == '(' || c == '[' || c == '{') stack.Push(c);\n        else {\n            if (stack.Count == 0) return false;\n            char top = stack.Pop();\n            if (c == ')' && top != '(') return false;\n            if (c == ']' && top != '[') return false;\n            if (c == '}' && top != '{') return false;\n        }\n    }\n    return stack.Count == 0;\n}\n\n// 단조 스택: 다음 더 큰 원소\nint[] NextGreaterElement(int[] nums) {\n    int n = nums.Length;\n    int[] result = new int[n];\n    Array.Fill(result, -1);\n    var stack = new Stack<int>(); // 인덱스 저장\n    for (int i = 0; i < n; i++) {\n        while (stack.Count > 0 && nums[stack.Peek()] < nums[i])\n            result[stack.Pop()] = nums[i];\n        stack.Push(i);\n    }\n    return result;\n}\n\n// 최솟값 O(1) 스택\nclass MinStack {\n    Stack<int> main = new(), minSt = new();\n    public void Push(int v) {\n        main.Push(v);\n        minSt.Push(minSt.Count == 0 ? v : Math.Min(v, minSt.Peek()));\n    }\n    public void Pop() { main.Pop(); minSt.Pop(); }\n    public int GetMin() => minSt.Peek();\n}",
      },
      {
        term: "큐 (Queue)",
        oneliner: "FIFO. Enqueue/Dequeue O(1). BFS의 핵심 자료구조",
        complexity: "Enqueue O(1) / Dequeue O(1) / Peek O(1) / 공간 O(n)",
        detail: [
          "핵심 개념: First In First Out. 가장 먼저 들어온 원소가 먼저 나옴",
          "C# 내장: Queue<T>. Enqueue(val), Dequeue(), Peek(), Count, Contains() 제공",
          "시간 복잡도: Enqueue, Dequeue, Peek 모두 O(1) 분할 상환. 내부 순환 배열 기반",
          "BFS 패턴: Queue + visited 배열(또는 HashSet)로 최단 경로, 레벨 탐색 구현",
          "코딩테스트 적용: BFS 그래프 탐색, 레벨 순서 트리 탐색, 프로세스 스케줄링 시뮬레이션",
          "레벨 BFS: 큐에서 꺼낼 때 현재 큐 크기만큼 반복 → 한 레벨씩 처리",
          "면접 포인트: 배열로 큐 구현 시 원형 배열 필요한 이유, 스택 두 개로 큐 구현",
          "흔한 실수: BFS에서 Enqueue 시점이 아닌 Dequeue 시점에 방문 처리 → 동일 노드 중복 삽입",
          "스택 두 개로 큐 구현: 입력 스택 + 출력 스택. 출력 스택 비었을 때만 이동 → 분할상환 O(1)",
          "우선순위 큐와 차이: 일반 큐는 FIFO, 우선순위 큐는 우선순위 높은 것 먼저",
        ],
        csharp:
          "// BFS 최단 거리 (그리드)\nint BFS(char[,] grid, int sr, int sc, int er, int ec) {\n    int rows = grid.GetLength(0), cols = grid.GetLength(1);\n    var queue = new Queue<(int r, int c)>();\n    var visited = new bool[rows, cols];\n    queue.Enqueue((sr, sc));\n    visited[sr, sc] = true;\n    int dist = 0;\n    int[] dr = {-1,1,0,0}, dc = {0,0,-1,1};\n    while (queue.Count > 0) {\n        int size = queue.Count;\n        for (int i = 0; i < size; i++) {\n            var (r, c) = queue.Dequeue();\n            if (r == er && c == ec) return dist;\n            for (int d = 0; d < 4; d++) {\n                int nr = r+dr[d], nc = c+dc[d];\n                if (nr>=0 && nr<rows && nc>=0 && nc<cols\n                    && !visited[nr,nc] && grid[nr,nc]!='#') {\n                    visited[nr,nc] = true;\n                    queue.Enqueue((nr, nc));\n                }\n            }\n        }\n        dist++;\n    }\n    return -1;\n}",
      },
      {
        term: "덱 (Deque / Dequeue)",
        oneliner: "양쪽 끝 삽입·삭제 O(1). 슬라이딩 윈도우 최댓값, 단조 덱 핵심",
        complexity: "양끝 삽입·삭제 O(1) / 임의 접근 O(1) / 공간 O(n)",
        detail: [
          "핵심 개념: Double-Ended Queue. 앞뒤 모두 O(1)로 삽입·삭제 가능",
          "C# 내장: C#에 전용 Deque 클래스 없음. LinkedList<T> 또는 직접 배열 기반 구현 사용",
          "LinkedList<T>로 덱 구현: AddFirst, AddLast, RemoveFirst, RemoveLast → 모두 O(1)",
          "슬라이딩 윈도우 최댓값: 단조 감소 덱 유지. 윈도우 밖 인덱스 앞에서 제거, 작은 값 뒤에서 제거",
          "단조 덱(Monotonic Deque): 덱 안의 인덱스가 항상 단조 증가, 값은 단조 감소(최댓값 기준) 유지",
          "시간 복잡도: 슬라이딩 윈도우 최댓값 O(n). 각 원소는 덱에 최대 1번 삽입·삭제",
          "코딩테스트 적용: 슬라이딩 윈도우 최댓값/최솟값, 서큘러 큐, 스택+큐 동시 기능 필요 시",
          "면접 포인트: 일반 큐+스택과 달리 양방향 접근이 O(1)인 이유, 단조 덱의 불변식 설명",
          "흔한 실수: 덱에서 인덱스 vs 값 저장 혼동. 슬라이딩 윈도우 최댓값은 인덱스 저장이 정확",
          "스택/큐 겸용: AddLast + RemoveLast면 스택, AddLast + RemoveFirst면 큐로 동작",
        ],
        csharp:
          "// 슬라이딩 윈도우 최댓값 (단조 덱)\nint[] MaxSlidingWindow(int[] nums, int k) {\n    int n = nums.Length;\n    int[] result = new int[n - k + 1];\n    // 덱에 인덱스 저장, 값은 단조 감소 유지\n    var deque = new LinkedList<int>();\n    for (int i = 0; i < n; i++) {\n        // 윈도우 밖 인덱스 제거\n        while (deque.Count > 0 && deque.First.Value < i - k + 1)\n            deque.RemoveFirst();\n        // 새 원소보다 작은 값 뒤에서 제거\n        while (deque.Count > 0 && nums[deque.Last.Value] < nums[i])\n            deque.RemoveLast();\n        deque.AddLast(i);\n        if (i >= k - 1)\n            result[i - k + 1] = nums[deque.First.Value];\n    }\n    return result;\n}\n\n// LinkedList<T>를 덱처럼 사용\nvar dq = new LinkedList<int>();\ndq.AddFirst(1);   // 앞 삽입\ndq.AddLast(2);    // 뒤 삽입\ndq.RemoveFirst(); // 앞 삭제\ndq.RemoveLast();  // 뒤 삭제\nint front = dq.First.Value; // 앞 조회\nint back  = dq.Last.Value;  // 뒤 조회",
      },
      {
        term: "단조 스택 (Monotonic Stack)",
        oneliner: "스택 단조성 유지로 '다음/이전 더 큰/작은 값' 문제를 O(n)에 해결",
        complexity: "시간 O(n) / 공간 O(n)",
        detail: [
          "핵심 개념: 스택에 원소를 넣을 때 단조 증가 또는 단조 감소 순서를 유지",
          "단조 감소 스택: 스택 top보다 큰 값 들어오면 pop. 결과로 각 원소의 '다음 더 큰 원소' 결정",
          "단조 증가 스택: 스택 top보다 작은 값 들어오면 pop. '다음 더 작은 원소' 탐색",
          "핵심 관찰: 각 원소는 스택에 최대 1번 push, 1번 pop → 전체 O(n)",
          "코딩테스트 적용: 히스토그램 최대 넓이, 빗물 트래핑, 주식 가격 스팬, NGE(Next Greater Element)",
          "히스토그램 최대 넓이: 단조 증가 스택으로 각 막대의 왼쪽/오른쪽 경계 O(n) 결정",
          "면접 포인트: 왜 O(n)인지 push/pop 총 횟수로 설명. 단조성 불변식 유지 조건 명확히",
          "흔한 실수: pop 시점에 결과를 계산해야 하는지 push 시점인지 혼동",
          "이중 단조 스택: 왼쪽·오른쪽 방향 각각 순회하여 양방향 경계 모두 계산",
          "순환 배열: 배열을 두 번 순회(i % n)하는 트릭으로 순환 배열에서 NGE 처리",
        ],
        csharp:
          "// 히스토그램 최대 넓이\nint LargestRectangle(int[] heights) {\n    int n = heights.Length, maxArea = 0;\n    var stack = new Stack<int>(); // 인덱스 저장\n    for (int i = 0; i <= n; i++) {\n        int h = (i == n) ? 0 : heights[i];\n        while (stack.Count > 0 && heights[stack.Peek()] > h) {\n            int height = heights[stack.Pop()];\n            int width = stack.Count == 0 ? i : i - stack.Peek() - 1;\n            maxArea = Math.Max(maxArea, height * width);\n        }\n        stack.Push(i);\n    }\n    return maxArea;\n}\n\n// 빗물 트래핑\nint Trap(int[] height) {\n    var stack = new Stack<int>();\n    int water = 0;\n    for (int i = 0; i < height.Length; i++) {\n        while (stack.Count > 0 && height[stack.Peek()] < height[i]) {\n            int mid = stack.Pop();\n            if (stack.Count > 0) {\n                int h = Math.Min(height[stack.Peek()], height[i]) - height[mid];\n                int w = i - stack.Peek() - 1;\n                water += h * w;\n            }\n        }\n        stack.Push(i);\n    }\n    return water;\n}",
      },
    ],
  },

  // ── 4. 해시맵 / 해시셋 ───────────────────────────────────
  {
    id: "hash-ds",
    title: "해시맵 / 해시셋",
    color: "yellow",
    items: [
      {
        term: "Dictionary<K, V> (해시맵)",
        oneliner: "키-값 쌍 저장. 평균 O(1) 삽입·삭제·탐색. 코딩테스트 빈도 1위 자료구조",
        complexity: "삽입·삭제·탐색 평균 O(1) / 최악 O(n) / 공간 O(n)",
        detail: [
          "핵심 개념: 키를 해시 함수로 변환해 버킷에 저장. 평균 O(1) 접근 가능",
          "C# 내장: Dictionary<TKey, TValue>. Add, Remove, TryGetValue, ContainsKey, Count",
          "시간 복잡도: 평균 O(1). 해시 충돌 심할 경우 최악 O(n). 실전에서는 거의 O(1)",
          "TryGetValue: ContainsKey + 인덱서 두 번 조회보다 효율적. 키 없을 때 예외 방지",
          "GetValueOrDefault: 없는 키에 기본값 반환. C# 2.0+ (dict.GetValueOrDefault(key, 0))",
          "코딩테스트 적용: 빈도 카운팅, 투 섬, 아나그램 탐지, 그룹화, 메모이제이션",
          "빈도 카운팅 패턴: dict[key] = dict.GetValueOrDefault(key) + 1; 로 간결하게",
          "면접 포인트: 해시 충돌 해결(체이닝 vs 개방 주소법), C# Dictionary가 체이닝 사용",
          "흔한 실수: 없는 키에 인덱서 접근 시 KeyNotFoundException. 반드시 TryGetValue 또는 ContainsKey 먼저",
          "SortedDictionary<K,V>: 레드-블랙 트리 기반. 탐색·삽입 O(log n). 키 정렬 필요 시 사용",
        ],
        csharp:
          "// 빈도 카운팅\nvar freq = new Dictionary<char, int>();\nforeach (char c in \"hello world\")\n    freq[c] = freq.GetValueOrDefault(c) + 1;\n\n// TryGetValue 안전 접근\nif (freq.TryGetValue('a', out int count))\n    Console.WriteLine(count);\n\n// 투 섬: 합이 target인 두 인덱스\nint[] TwoSum(int[] nums, int target) {\n    var map = new Dictionary<int, int>(); // 값 → 인덱스\n    for (int i = 0; i < nums.Length; i++) {\n        int complement = target - nums[i];\n        if (map.TryGetValue(complement, out int j))\n            return new[] { j, i };\n        map[nums[i]] = i;\n    }\n    return Array.Empty<int>();\n}\n\n// 그룹 아나그램\nIList<IList<string>> GroupAnagrams(string[] strs) {\n    var map = new Dictionary<string, List<string>>();\n    foreach (string s in strs) {\n        char[] key = s.ToCharArray();\n        Array.Sort(key);\n        string k = new string(key);\n        if (!map.ContainsKey(k)) map[k] = new List<string>();\n        map[k].Add(s);\n    }\n    return new List<IList<string>>(map.Values);\n}",
      },
      {
        term: "HashSet<T> (해시셋)",
        oneliner: "중복 없는 집합. 삽입·포함여부 O(1). 방문 처리, 중복 제거에 핵심",
        complexity: "삽입·삭제·포함 평균 O(1) / 공간 O(n)",
        detail: [
          "핵심 개념: 중복을 허용하지 않는 집합. 순서 보장 없음",
          "C# 내장: HashSet<T>. Add, Remove, Contains, Count, UnionWith, IntersectWith, ExceptWith",
          "시간 복잡도: Add, Remove, Contains 평균 O(1). 집합 연산(합집합 등) O(n)",
          "BFS/DFS 방문 처리: bool[] visited 대신 HashSet<T>로 복합 상태 방문 처리 가능",
          "코딩테스트 적용: 중복 제거, 방문 여부 O(1) 확인, 두 배열 교집합/합집합, 연속 수열 탐색",
          "연속 수열 최장 길이: HashSet + 시작점 탐색(n-1이 없는 경우만 탐색) → O(n)",
          "면접 포인트: Dictionary<K,bool> 대신 HashSet 사용 이유. 내부적으로 Dictionary와 동일 구조",
          "흔한 실수: Contains 전에 Add하면 중복 추가 시도됨(실패). Add 반환값(bool)으로 성공 여부 확인",
          "SortedSet<T>: 레드-블랙 트리. 정렬된 집합 필요 시. Min, Max, GetViewBetween O(log n)",
          "참조 타입 커스텀 해시: GetHashCode() + Equals() 오버라이드 필수, 또는 IEqualityComparer<T> 제공",
        ],
        csharp:
          "// 중복 제거 후 개수\nvar set = new HashSet<int>(new[] { 1, 2, 2, 3, 3 });\nConsole.WriteLine(set.Count); // 3\n\n// 가장 긴 연속 수열\nint LongestConsecutive(int[] nums) {\n    var numSet = new HashSet<int>(nums);\n    int longest = 0;\n    foreach (int n in numSet) {\n        if (numSet.Contains(n - 1)) continue; // 시작점만 탐색\n        int cur = n, len = 1;\n        while (numSet.Contains(cur + 1)) { cur++; len++; }\n        longest = Math.Max(longest, len);\n    }\n    return longest;\n}\n\n// 두 배열 교집합\nint[] Intersection(int[] a, int[] b) {\n    var setA = new HashSet<int>(a);\n    var result = new HashSet<int>();\n    foreach (int x in b)\n        if (setA.Contains(x)) result.Add(x);\n    return result.ToArray();\n}\n\n// BFS 복합 상태 방문\nvar visited = new HashSet<(int, int)>();\nvisited.Add((0, 0));\nif (!visited.Contains((1, 1))) {\n    visited.Add((1, 1));\n}",
      },
      {
        term: "해시 충돌 & 설계",
        oneliner: "충돌 해결: 체이닝(연결리스트) vs 개방 주소법(탐사). C#은 체이닝 방식",
        complexity: "평균 O(1) / 최악(충돌 심각) O(n) / 부하율 관리로 O(1) 유지",
        detail: [
          "해시 함수: 키를 버킷 인덱스로 변환. 좋은 해시 함수 = 균등 분포 + 빠른 계산",
          "체이닝(Chaining): 같은 버킷에 연결리스트로 충돌 원소 저장. C# Dictionary가 사용하는 방식",
          "개방 주소법(Open Addressing): 충돌 시 다음 빈 버킷 탐사(선형/이차/이중 해싱)",
          "부하율(Load Factor): 원소 수 / 버킷 수. C# Dictionary는 기본 0.72 초과 시 2배 재해싱",
          "C# Dictionary 내부: 배열 + 연결리스트 체인. 각 버킷은 Entry 구조체 배열의 인덱스",
          "커스텀 해시: struct/class에서 GetHashCode()는 반드시 Equals()와 일관성 유지",
          "면접 포인트: 해시맵 최악 O(n) 발생 조건(모든 키 동일 버킷), 재해싱 비용(O(n)이나 분할 상환 O(1))",
          "흔한 실수: mutable 객체를 키로 사용 → 해시코드 변경 시 검색 불가",
          "GetHashCode 규칙: 같은 객체는 항상 같은 해시코드, Equals true이면 해시코드 같아야 함",
          "안티패턴: 코딩테스트에서 string을 지속 생성하여 키로 사용 → GC 압박. int 튜플 키 권장",
        ],
        csharp:
          "// 커스텀 GetHashCode + Equals\nstruct Point {\n    public int X, Y;\n    public override int GetHashCode() => HashCode.Combine(X, Y);\n    public override bool Equals(object obj) =>\n        obj is Point p && p.X == X && p.Y == Y;\n}\n\n// Dictionary 사용 시 커스텀 비교자\nvar dict = new Dictionary<int[], int>(new ArrayEqualityComparer());\n\nclass ArrayEqualityComparer : IEqualityComparer<int[]> {\n    public bool Equals(int[] x, int[] y) =>\n        x != null && y != null && x.SequenceEqual(y);\n    public int GetHashCode(int[] arr) {\n        var hash = new HashCode();\n        foreach (int v in arr) hash.Add(v);\n        return hash.ToHashCode();\n    }\n}\n\n// 재해싱 최소화: 초기 용량 지정\nvar map = new Dictionary<int, int>(capacity: 1000);\nvar set = new HashSet<int>(capacity: 500);",
      },
    ],
  },

  // ── 5. 트리 (BST / 힙 / 트라이) ──────────────────────────
  {
    id: "tree-ds",
    title: "트리 (BST / 힙 / 트라이)",
    color: "white",
    items: [
      {
        term: "이진 탐색 트리 (BST)",
        oneliner: "왼쪽 < 루트 < 오른쪽 불변식. 탐색·삽입·삭제 평균 O(log n)",
        complexity: "탐색·삽입·삭제 평균 O(log n) / 최악(편향) O(n) / 공간 O(n)",
        detail: [
          "핵심 개념: 모든 노드에서 왼쪽 서브트리 < 노드 < 오른쪽 서브트리 불변식 유지",
          "중위 순회(in-order) = 정렬된 순서 출력. 'BST를 정렬된 배열로' 문제에 활용",
          "시간 복잡도: 균형 트리 O(log n), 편향(정렬된 입력) 시 O(n). 이를 해결하려면 AVL/Red-Black Tree 필요",
          "삽입: 루트부터 비교하며 재귀 또는 반복으로 적절한 위치에 삽입",
          "삭제: 세 경우 — 리프 노드, 자식 하나, 자식 둘(오른쪽 서브트리 최솟값 = 후계자로 교체)",
          "C# SortedSet<T>: 레드-블랙 트리 기반. Min, Max, GetViewBetween, Contains, Add, Remove",
          "코딩테스트 적용: 'Validate BST', 'Kth Smallest in BST', 'LCA in BST', 'Convert BST to Sorted Array'",
          "면접 포인트: BST 순회 3가지(전위/중위/후위) 설명, 편향 문제와 균형 트리 해결책",
          "흔한 실수: 삭제 시 후계자(in-order successor) 탐색 로직 오류, 중위 순회 재귀 스택 오버플로우",
          "AVL vs Red-Black: AVL은 더 엄격한 균형(탐색 빠름), Red-Black은 삽입/삭제 빠름. C# SortedSet은 Red-Black",
        ],
        csharp:
          "class TreeNode {\n    public int Val; public TreeNode Left, Right;\n    public TreeNode(int val) { Val = val; }\n}\n\n// BST 삽입\nTreeNode Insert(TreeNode root, int val) {\n    if (root == null) return new TreeNode(val);\n    if (val < root.Val) root.Left = Insert(root.Left, val);\n    else if (val > root.Val) root.Right = Insert(root.Right, val);\n    return root;\n}\n\n// 중위 순회 (정렬 순서)\nvoid InOrder(TreeNode node, List<int> result) {\n    if (node == null) return;\n    InOrder(node.Left, result);\n    result.Add(node.Val);\n    InOrder(node.Right, result);\n}\n\n// BST 유효성 검사\nbool IsValidBST(TreeNode node, long min = long.MinValue, long max = long.MaxValue) {\n    if (node == null) return true;\n    if (node.Val <= min || node.Val >= max) return false;\n    return IsValidBST(node.Left, min, node.Val)\n        && IsValidBST(node.Right, node.Val, max);\n}\n\n// K번째 최솟값 (중위 순회)\nint KthSmallest(TreeNode root, int k) {\n    var stack = new Stack<TreeNode>();\n    TreeNode cur = root;\n    while (cur != null || stack.Count > 0) {\n        while (cur != null) { stack.Push(cur); cur = cur.Left; }\n        cur = stack.Pop();\n        if (--k == 0) return cur.Val;\n        cur = cur.Right;\n    }\n    return -1;\n}",
      },
      {
        term: "힙 / 우선순위 큐 (Heap / Priority Queue)",
        oneliner: "최솟값(또는 최댓값) O(1) 조회, 삽입·삭제 O(log n). Top-K와 다익스트라 핵심",
        complexity: "삽입 O(log n) / 최솟값 조회 O(1) / 삭제 O(log n) / 빌드힙 O(n) / 공간 O(n)",
        detail: [
          "핵심 개념: 완전 이진 트리 + 힙 속성(부모 ≤ 자식 for min-heap). 배열로 구현",
          "배열 표현: 인덱스 i의 부모 (i-1)/2, 왼쪽 자식 2i+1, 오른쪽 자식 2i+2",
          "C# PriorityQueue<TElement, TPriority>: .NET 6+. Enqueue(element, priority), Dequeue(), Peek()",
          "시간 복잡도: 삽입/삭제 O(log n), 최솟값 조회 O(1), 배열로 힙 빌드 O(n)",
          "Top-K 최솟값: 크기 K 최대힙 유지 → K번째로 작은 값들 유지",
          "Top-K 최댓값: 크기 K 최소힙 유지 → 힙 루트가 K번째로 큰 값",
          "다익스트라: MinHeap + (거리, 노드) 쌍. 우선순위 큐로 최단 거리 노드 O(log V) 추출",
          "코딩테스트 적용: 'Kth Largest Element', '합이 K번째 쌍', '작업 스케줄링', '힙 정렬'",
          "면접 포인트: 힙 정렬 O(n log n), 힙 빌드 O(n) 증명, MinHeap vs MaxHeap 전환(우선순위 부호 반전)",
          "흔한 실수: PriorityQueue에서 동일 우선순위 원소 순서 보장 없음. FIFO 필요 시 타임스탬프 추가",
        ],
        csharp:
          "// C# PriorityQueue (MinHeap)\nvar pq = new PriorityQueue<string, int>();\npq.Enqueue(\"task1\", 3);\npq.Enqueue(\"task2\", 1);\npq.Enqueue(\"task3\", 2);\nwhile (pq.Count > 0)\n    Console.WriteLine(pq.Dequeue()); // task2, task3, task1\n\n// MaxHeap: 우선순위 부호 반전\nvar maxPQ = new PriorityQueue<int, int>();\nvoid MaxEnqueue(int val) => maxPQ.Enqueue(val, -val);\nint MaxDequeue() => maxPQ.Dequeue();\n\n// K번째로 큰 원소 (크기 K 최소힙)\nint FindKthLargest(int[] nums, int k) {\n    var pq = new PriorityQueue<int, int>();\n    foreach (int n in nums) {\n        pq.Enqueue(n, n);\n        if (pq.Count > k) pq.Dequeue();\n    }\n    return pq.Peek();\n}\n\n// 다익스트라\nint[] Dijkstra(int[][] graph, int src, int n) {\n    int[] dist = new int[n];\n    Array.Fill(dist, int.MaxValue);\n    dist[src] = 0;\n    var pq = new PriorityQueue<(int node, int d), int>();\n    pq.Enqueue((src, 0), 0);\n    while (pq.Count > 0) {\n        var (u, d) = pq.Dequeue();\n        if (d > dist[u]) continue;\n        foreach (var (v, w) in GetNeighbors(graph, u))\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.Enqueue((v, dist[v]), dist[v]);\n            }\n    }\n    return dist;\n}\n\nIEnumerable<(int, int)> GetNeighbors(int[][] g, int u)\n    => g[u].Select((w, v) => (v, w)).Where(x => x.w > 0);",
      },
      {
        term: "트라이 (Trie / Prefix Tree)",
        oneliner: "문자 단위 트리. 문자열 삽입·탐색 O(L). 자동완성·접두사 검색에 최적",
        complexity: "삽입·탐색 O(L) / 공간 O(알파벳크기 × 최대길이 × 노드수)",
        detail: [
          "핵심 개념: 각 노드가 문자 하나를 대표. 루트에서 단말 노드까지 경로 = 단어",
          "시간 복잡도: 삽입·탐색·삭제 O(L). L은 문자열 길이. 해시맵보다 접두사 탐색에 효율적",
          "공간 복잡도: 각 노드에 알파벳 크기(26) 배열 또는 Dictionary<char, TrieNode> 저장",
          "isEnd 플래그: 노드가 단어의 끝인지 표시. 탐색 종료 조건",
          "C# 구현: TrieNode 클래스 + Dictionary<char, TrieNode> children 또는 TrieNode[26] 배열",
          "코딩테스트 적용: '자동완성', '단어 검색', '접두사 존재 여부', 'Word Search II(트라이+백트래킹)'",
          "StartsWith vs Search: StartsWith는 접두사만 확인, Search는 isEnd까지 확인",
          "면접 포인트: 트라이 vs 해시셋 비교. 해시셋은 완전 일치만, 트라이는 접두사·와일드카드 지원",
          "압축 트라이(Radix Tree): 단일 자식 노드를 합쳐 공간 최적화. 실무에서 IP 라우팅에 사용",
          "흔한 실수: isEnd 설정 누락(단어로 등록 안 됨), 삭제 시 공유 접두사 노드 제거 주의",
        ],
        csharp:
          "class TrieNode {\n    public Dictionary<char, TrieNode> Children = new();\n    public bool IsEnd = false;\n}\n\nclass Trie {\n    private readonly TrieNode _root = new();\n\n    public void Insert(string word) {\n        var node = _root;\n        foreach (char c in word) {\n            if (!node.Children.ContainsKey(c))\n                node.Children[c] = new TrieNode();\n            node = node.Children[c];\n        }\n        node.IsEnd = true;\n    }\n\n    public bool Search(string word) {\n        var node = _root;\n        foreach (char c in word) {\n            if (!node.Children.TryGetValue(c, out node)) return false;\n        }\n        return node.IsEnd;\n    }\n\n    public bool StartsWith(string prefix) {\n        var node = _root;\n        foreach (char c in prefix) {\n            if (!node.Children.TryGetValue(c, out node)) return false;\n        }\n        return true;\n    }\n\n    // 주어진 접두사로 시작하는 모든 단어\n    public List<string> GetWordsWithPrefix(string prefix) {\n        var node = _root;\n        foreach (char c in prefix)\n            if (!node.Children.TryGetValue(c, out node)) return new();\n        var result = new List<string>();\n        DFS(node, new System.Text.StringBuilder(prefix), result);\n        return result;\n    }\n\n    private void DFS(TrieNode node, System.Text.StringBuilder sb, List<string> res) {\n        if (node.IsEnd) res.Add(sb.ToString());\n        foreach (var (c, child) in node.Children) {\n            sb.Append(c);\n            DFS(child, sb, res);\n            sb.Length--;\n        }\n    }\n}",
      },
    ],
  },

  // ── 6. 그래프 ────────────────────────────────────────────
  {
    id: "graph-ds",
    title: "그래프",
    color: "red",
    items: [
      {
        term: "그래프 표현: 인접 리스트 vs 인접 행렬",
        oneliner: "희소 그래프는 인접 리스트 O(V+E), 밀집 그래프는 인접 행렬 O(V²)",
        complexity: "인접 리스트: 공간 O(V+E) / 인접 행렬: 공간 O(V²)",
        detail: [
          "인접 리스트: Dictionary<int, List<int>> 또는 List<int>[] adjacency. 희소 그래프에 효율적",
          "인접 행렬: bool[,] 또는 int[,]. 간선 존재 여부 O(1) 확인. 밀집 그래프나 플로이드-워셜에 적합",
          "간선 리스트: (u, v, w) 튜플 리스트. 크루스칼 알고리즘 등 간선 중심 알고리즘에 사용",
          "C# 구현: List<(int to, int weight)>[] graph = new List<(int,int)>[n];",
          "방향 그래프 vs 무방향 그래프: 무방향은 u→v, v→u 양쪽 모두 추가",
          "코딩테스트 적용: 대부분 인접 리스트. 그리드 문제는 암묵적 그래프(방향 벡터로 이웃 탐색)",
          "면접 포인트: V=10, E=1000 이면 인접 행렬 vs 리스트 어느 게 유리한지, 각 표현의 순회 비용",
          "DFS 순회: 인접 리스트 O(V+E), 인접 행렬 O(V²). 인접 리스트가 희소 그래프에서 훨씬 효율적",
          "흔한 실수: 무방향 그래프에서 한 방향만 추가, 가중치 초기화(없는 간선을 0으로 두면 모호함)",
          "암묵적 그래프: 그리드, 상태 공간 등 노드·간선을 명시 저장 안 하고 on-the-fly 계산",
        ],
        csharp:
          "// 인접 리스트 구성\nint n = 5;\nvar graph = new List<(int to, int weight)>[n];\nfor (int i = 0; i < n; i++) graph[i] = new();\n\n// 무방향 가중치 그래프\nvoid AddEdge(int u, int v, int w) {\n    graph[u].Add((v, w));\n    graph[v].Add((u, w)); // 무방향\n}\n\n// DFS (재귀)\nvoid DFS(int node, bool[] visited) {\n    visited[node] = true;\n    foreach (var (next, _) in graph[node]) {\n        if (!visited[next]) DFS(next, visited);\n    }\n}\n\n// BFS (최단 거리)\nint[] BFSDist(int start) {\n    int[] dist = new int[n];\n    Array.Fill(dist, -1);\n    dist[start] = 0;\n    var queue = new Queue<int>();\n    queue.Enqueue(start);\n    while (queue.Count > 0) {\n        int u = queue.Dequeue();\n        foreach (var (v, _) in graph[u]) {\n            if (dist[v] == -1) {\n                dist[v] = dist[u] + 1;\n                queue.Enqueue(v);\n            }\n        }\n    }\n    return dist;\n}",
      },
      {
        term: "Union-Find (Disjoint Set Union)",
        oneliner: "집합 합치기/같은 집합 여부 판단. 경로 압축+랭크로 거의 O(1)",
        complexity: "Find·Union 거의 O(1) (역 아커만 함수) / 공간 O(n)",
        detail: [
          "핵심 개념: 원소들을 분리 집합으로 관리. Find(루트 탐색)와 Union(집합 합치기) 연산",
          "경로 압축(Path Compression): Find 시 경로 상 모든 노드를 루트에 직접 연결 → 트리 평탄화",
          "랭크/크기 기반 합치기(Union by Rank/Size): 작은 트리를 큰 트리 아래에 붙임 → 트리 높이 최소화",
          "두 기법 결합: 역 아커만 함수 α(n) ≈ O(1) 성능. 실전에서 상수 시간으로 간주",
          "C# 구현: int[] parent, rank 배열. 생성자에서 parent[i]=i 초기화",
          "코딩테스트 적용: 연결 컴포넌트 수, 사이클 감지, 크루스칼 MST, '같은 그룹인가' 실시간 쿼리",
          "사이클 감지: 간선 (u,v) 추가 전 Find(u)==Find(v)이면 사이클 존재",
          "면접 포인트: 경로 압축 없이 O(n) 최악, 경로 압축+랭크로 거의 O(1). 구현 직접 작성 연습 필수",
          "흔한 실수: Union 시 두 루트를 비교하지 않고 원소를 직접 합침, 경로 압축 재귀 vs 반복 구분",
          "크루스칼 MST: 간선 가중치 정렬 후 Union-Find로 사이클 없는 간선만 선택 → O(E log E)",
        ],
        csharp:
          "class UnionFind {\n    int[] parent, rank;\n    public int Components;\n\n    public UnionFind(int n) {\n        parent = Enumerable.Range(0, n).ToArray();\n        rank = new int[n];\n        Components = n;\n    }\n\n    public int Find(int x) {\n        if (parent[x] != x)\n            parent[x] = Find(parent[x]); // 경로 압축\n        return parent[x];\n    }\n\n    public bool Union(int x, int y) {\n        int px = Find(x), py = Find(y);\n        if (px == py) return false; // 이미 같은 집합\n        if (rank[px] < rank[py]) (px, py) = (py, px);\n        parent[py] = px;\n        if (rank[px] == rank[py]) rank[px]++;\n        Components--;\n        return true;\n    }\n\n    public bool Connected(int x, int y) => Find(x) == Find(y);\n}\n\n// 크루스칼 MST\nint Kruskal(int n, int[][] edges) {\n    Array.Sort(edges, (a, b) => a[2] - b[2]);\n    var uf = new UnionFind(n);\n    int cost = 0;\n    foreach (var e in edges)\n        if (uf.Union(e[0], e[1])) cost += e[2];\n    return cost;\n}",
      },
      {
        term: "위상 정렬 (Topological Sort)",
        oneliner: "DAG의 선후 관계 정렬. Kahn(BFS) 또는 DFS 후위. 사이클 감지에도 활용",
        complexity: "시간 O(V+E) / 공간 O(V+E)",
        detail: [
          "핵심 개념: 방향 비순환 그래프(DAG)에서 간선 방향과 일치하는 노드 순서 결정",
          "Kahn 알고리즘(BFS 기반): 진입 차수 0인 노드부터 큐에 삽입 → 처리하며 이웃 진입 차수 감소",
          "DFS 기반: 모든 노드 DFS 후위 순서(post-order) 수집 후 역순 출력",
          "사이클 감지: Kahn 알고리즘에서 처리된 노드 수 < V 이면 사이클 존재",
          "시간 복잡도: O(V+E). 모든 노드와 간선을 한 번씩 처리",
          "코딩테스트 적용: '강의 수강 순서', '빌드 의존성', '작업 스케줄링', '레벨별 처리 순서'",
          "면접 포인트: DAG 조건 필수. 사이클 있으면 위상 정렬 불가. 결과가 유일하지 않을 수 있음",
          "흔한 실수: 진입 차수 배열 초기화 오류, 무방향 그래프에 적용 시도(모든 간선이 사이클을 형성)",
          "결과 유일성: 큐에 항상 1개 노드만 있으면 유일한 위상 정렬(완전한 의존 순서 존재)",
          "응용: 레벨별 처리(BFS 레벨 순서)로 병렬 처리 가능한 작업 그룹 탐색",
        ],
        csharp:
          "// Kahn 알고리즘 (BFS 위상 정렬)\nint[] TopologicalSort(int n, int[][] prerequisites) {\n    var graph = new List<int>[n];\n    int[] inDegree = new int[n];\n    for (int i = 0; i < n; i++) graph[i] = new();\n    foreach (var p in prerequisites) {\n        graph[p[1]].Add(p[0]);\n        inDegree[p[0]]++;\n    }\n    var queue = new Queue<int>();\n    for (int i = 0; i < n; i++)\n        if (inDegree[i] == 0) queue.Enqueue(i);\n    var order = new List<int>();\n    while (queue.Count > 0) {\n        int u = queue.Dequeue();\n        order.Add(u);\n        foreach (int v in graph[u]) {\n            if (--inDegree[v] == 0) queue.Enqueue(v);\n        }\n    }\n    // order.Count < n 이면 사이클 존재\n    return order.Count == n ? order.ToArray() : Array.Empty<int>();\n}\n\n// DFS 기반 위상 정렬\nvoid DFSTopo(int u, bool[] visited, Stack<int> stack, List<int>[] graph) {\n    visited[u] = true;\n    foreach (int v in graph[u])\n        if (!visited[v]) DFSTopo(v, visited, stack, graph);\n    stack.Push(u); // 후위 순서\n}",
      },
    ],
  },

  // ── 7. 고급 자료구조 ──────────────────────────────────────
  {
    id: "advanced-ds",
    title: "고급 자료구조",
    color: "yellow",
    items: [
      {
        term: "세그먼트 트리 (Segment Tree)",
        oneliner: "구간 쿼리(합·최솟값·최댓값) O(log n) + 점 업데이트 O(log n). 배열 기반",
        complexity: "빌드 O(n) / 쿼리 O(log n) / 업데이트 O(log n) / 공간 O(4n)",
        detail: [
          "핵심 개념: 배열을 이진 트리로 분할 관리. 각 노드가 구간 정보(합·최솟·최댓값 등) 저장",
          "배열 기반 구현: 크기 4n 배열. 노드 i의 왼쪽 자식 2i, 오른쪽 2i+1 (1-indexed)",
          "빌드: O(n). 하향식으로 리프까지 분할 후 상향식 집계",
          "점 업데이트: O(log n). 해당 리프 갱신 후 부모 노드 재계산",
          "구간 쿼리: O(log n). 쿼리 범위와 노드 범위 비교하며 분기",
          "Lazy Propagation: 구간 업데이트를 O(log n)으로. 지연 태그를 쌓아두고 필요할 때 전파",
          "코딩테스트 적용: '구간 합 + 점 업데이트', '구간 최솟/최댓값 반복 쿼리', '구간 업데이트(레이지)'",
          "면접 포인트: prefix sum 대비 장점(업데이트 O(log n) vs O(n)), Fenwick Tree와 비교",
          "Prefix Sum vs 세그먼트 트리: prefix는 업데이트 O(n), 세그먼트 트리는 O(log n). 업데이트 없으면 prefix 충분",
          "흔한 실수: 1-indexed vs 0-indexed 혼동, 배열 크기 4n 미만으로 설정 시 범위 초과",
        ],
        csharp:
          "class SegmentTree {\n    int[] tree;\n    int n;\n    public SegmentTree(int[] arr) {\n        n = arr.Length;\n        tree = new int[4 * n];\n        Build(arr, 1, 0, n - 1);\n    }\n    void Build(int[] arr, int node, int start, int end) {\n        if (start == end) { tree[node] = arr[start]; return; }\n        int mid = (start + end) / 2;\n        Build(arr, 2*node, start, mid);\n        Build(arr, 2*node+1, mid+1, end);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n    public void Update(int node, int start, int end, int idx, int val) {\n        if (start == end) { tree[node] = val; return; }\n        int mid = (start + end) / 2;\n        if (idx <= mid) Update(2*node, start, mid, idx, val);\n        else Update(2*node+1, mid+1, end, idx, val);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n    public int Query(int node, int start, int end, int l, int r) {\n        if (r < start || end < l) return 0;\n        if (l <= start && end <= r) return tree[node];\n        int mid = (start + end) / 2;\n        return Query(2*node, start, mid, l, r)\n             + Query(2*node+1, mid+1, end, l, r);\n    }\n    public void Update(int idx, int val) => Update(1, 0, n-1, idx, val);\n    public int Query(int l, int r) => Query(1, 0, n-1, l, r);\n}",
      },
      {
        term: "Fenwick Tree / BIT (Binary Indexed Tree)",
        oneliner: "prefix sum의 업데이트 가능 버전. 구현 간단, 삽입·쿼리 O(log n)",
        complexity: "업데이트 O(log n) / 구간합 쿼리 O(log n) / 공간 O(n)",
        detail: [
          "핵심 개념: 각 인덱스가 책임지는 구간 크기를 이진 표현의 최하위 비트(LSB)로 결정",
          "LSB 트릭: i & (-i) 로 최하위 비트 추출. 업데이트 시 LSB 더하고, 쿼리 시 LSB 빼기",
          "1-indexed 구현: 0번 인덱스 사용 안 함. 이유: 0 & (-0) = 0으로 무한 루프",
          "시간 복잡도: 업데이트·쿼리 모두 O(log n). 세그먼트 트리보다 구현 짧고 상수 인자 작음",
          "공간 복잡도: O(n). 세그먼트 트리의 O(4n) 대비 효율적",
          "코딩테스트 적용: '구간 합 + 점 업데이트', '역전 쌍 개수(좌표 압축+BIT)', '합이 특정 값인 부분배열 수'",
          "면접 포인트: BIT vs 세그먼트 트리 — BIT는 합·점 업데이트만, 세그먼트 트리는 최솟·최댓·구간 업데이트도",
          "2D BIT: 2차원 구간 합 + 점 업데이트. bit[i][j] 사용, 루프 이중 중첩",
          "좌표 압축: 값 범위 크고 개수 적을 때 BIT 인덱스로 변환. 역전 쌍 문제 등에 핵심",
          "흔한 실수: 0-indexed로 구현 시 i & (-i) 트릭 오작동. 반드시 1부터 시작",
        ],
        csharp:
          "class BIT {\n    int[] tree;\n    int n;\n    public BIT(int n) { this.n = n; tree = new int[n + 1]; }\n\n    public void Update(int i, int delta) {\n        for (; i <= n; i += i & (-i))\n            tree[i] += delta;\n    }\n\n    public int Query(int i) {\n        int sum = 0;\n        for (; i > 0; i -= i & (-i))\n            sum += tree[i];\n        return sum;\n    }\n\n    public int Query(int l, int r) => Query(r) - Query(l - 1);\n}\n\n// 역전 쌍 개수 (좌표 압축 + BIT)\nint CountInversions(int[] arr) {\n    int n = arr.Length;\n    int[] sorted = arr.OrderBy(x => x).Distinct().ToArray();\n    var compress = new Dictionary<int, int>();\n    for (int i = 0; i < sorted.Length; i++) compress[sorted[i]] = i + 1;\n    var bit = new BIT(sorted.Length);\n    int count = 0;\n    for (int i = n - 1; i >= 0; i--) {\n        int rank = compress[arr[i]];\n        count += bit.Query(rank - 1); // arr[i]보다 작은 값 중 오른쪽에 있는 수\n        bit.Update(rank, 1);\n    }\n    return count;\n}",
      },
      {
        term: "LRU 캐시 (Least Recently Used Cache)",
        oneliner: "가장 오래 안 쓴 항목 제거. HashMap + 이중 연결리스트로 O(1) get·put",
        complexity: "Get·Put O(1) / 공간 O(capacity)",
        detail: [
          "핵심 개념: 용량 초과 시 가장 오래 사용하지 않은 항목 제거. 캐시 교체 정책",
          "자료구조 조합: HashMap(키→노드 O(1) 접근) + 이중 연결리스트(사용 순서 유지, O(1) 이동)",
          "이중 연결리스트: 양 끝에 더미 헤드·테일. 최근 사용 = head.next, 가장 오래됨 = tail.prev",
          "Get: 해시맵으로 노드 O(1) 탐색 → 해당 노드를 head로 이동",
          "Put: 있으면 값 갱신 후 head 이동. 없으면 새 노드 head에 삽입. 용량 초과 시 tail 제거",
          "C# LinkedList<T>: AddFirst, Remove, Last 속성으로 LRU 구현 가능",
          "코딩테스트 적용: LRU Cache 구현 문제. 자주 출제되는 설계 문제",
          "면접 포인트: 왜 이중 연결리스트인가(단방향은 노드 제거에 O(n)), 왜 더미 노드인가(엣지케이스 단순화)",
          "흔한 실수: Get 시 노드 이동 누락(캐시 히트인데 순서 안 갱신), Put 시 용량 체크 위치 오류",
          "확장 LFU: 사용 빈도가 가장 낮은 항목 제거. LRU보다 복잡. 빈도별 버킷(HashMap<freq, LinkedList>) 사용",
        ],
        csharp:
          "class LRUCache {\n    class Node {\n        public int Key, Val;\n        public Node Prev, Next;\n        public Node(int k, int v) { Key = k; Val = v; }\n    }\n    int _cap;\n    Dictionary<int, Node> _map = new();\n    Node _head = new(0, 0), _tail = new(0, 0);\n\n    public LRUCache(int capacity) {\n        _cap = capacity;\n        _head.Next = _tail;\n        _tail.Prev = _head;\n    }\n    void Remove(Node n) {\n        n.Prev.Next = n.Next;\n        n.Next.Prev = n.Prev;\n    }\n    void AddFront(Node n) {\n        n.Next = _head.Next;\n        n.Prev = _head;\n        _head.Next.Prev = n;\n        _head.Next = n;\n    }\n    public int Get(int key) {\n        if (!_map.TryGetValue(key, out var node)) return -1;\n        Remove(node); AddFront(node);\n        return node.Val;\n    }\n    public void Put(int key, int value) {\n        if (_map.TryGetValue(key, out var node)) {\n            Remove(node); node.Val = value; AddFront(node);\n        } else {\n            if (_map.Count == _cap) {\n                _map.Remove(_tail.Prev.Key);\n                Remove(_tail.Prev);\n            }\n            var newNode = new Node(key, value);\n            _map[key] = newNode;\n            AddFront(newNode);\n        }\n    }\n}",
      },
      {
        term: "비트마스킹 / 비트 DP",
        oneliner: "집합을 정수 비트로 표현. 부분집합 탐색·DP 상태를 O(1) 연산으로 압축",
        complexity: "부분집합 탐색 O(2ⁿ) / 비트 연산 O(1) / 비트 DP 공간 O(2ⁿ × n)",
        detail: [
          "핵심 개념: n개의 원소 집합을 n비트 정수로 표현. 비트 i가 1이면 i번째 원소 포함",
          "핵심 연산: OR(합집합), AND(교집합), XOR(대칭 차), NOT(여집합), SHL/SHR(시프트)",
          "원소 추가: mask | (1 << i). 원소 제거: mask & ~(1 << i). 포함 여부: (mask >> i) & 1",
          "모든 부분집합 열거: for (int mask=0; mask<(1<<n); mask++) — O(2ⁿ)",
          "특정 마스크의 부분집합만 열거: for (int sub=mask; sub>0; sub=(sub-1)&mask) — O(3ⁿ) 합",
          "비트 DP: dp[mask] = mask 비트가 선택된 상태에서의 최적값. TSP, 집합 커버 등에 적용",
          "C# 사용법: <<, >>, &, |, ^ 연산자. popcount는 BitOperations.PopCount(uint)",
          "코딩테스트 적용: '최소 선택 조합', 'TSP(외판원 순회)', '집합 DP', '상태 압축 BFS'",
          "면접 포인트: 비트마스크 DP가 일반 DP 대비 효율적인 이유(상태 공간 압축), n 제한 보통 ≤ 20",
          "흔한 실수: int는 32비트(n≤30), long은 64비트(n≤60). n 크면 long 사용",
        ],
        csharp:
          "// 비트마스크 기본 연산\nint mask = 0;\nmask |= (1 << 2);            // 2번 원소 추가\nmask &= ~(1 << 2);           // 2번 원소 제거\nbool has = ((mask >> 3) & 1) == 1; // 3번 포함 여부\nint cnt = System.Numerics.BitOperations.PopCount((uint)mask); // 비트 수\n\n// 모든 부분집합\nint n = 4;\nfor (int s = 0; s < (1 << n); s++) {\n    // s의 각 비트 = 선택된 원소\n    for (int i = 0; i < n; i++)\n        if (((s >> i) & 1) == 1) { /* i번 원소 선택 */ }\n}\n\n// 비트 DP: TSP (최소 비용으로 모든 도시 방문)\nint TSP(int[,] dist, int n) {\n    int full = (1 << n) - 1;\n    int[,] dp = new int[1 << n, n];\n    foreach (var row in Enumerable.Range(0, 1 << n))\n        for (int j = 0; j < n; j++) dp[row, j] = int.MaxValue / 2;\n    dp[1, 0] = 0; // 0번 도시에서 출발\n    for (int mask = 1; mask < (1 << n); mask++)\n        for (int u = 0; u < n; u++) {\n            if (((mask >> u) & 1) == 0) continue;\n            for (int v = 0; v < n; v++) {\n                if (((mask >> v) & 1) == 1) continue;\n                int next = mask | (1 << v);\n                dp[next, v] = Math.Min(dp[next, v], dp[mask, u] + dist[u, v]);\n            }\n        }\n    int res = int.MaxValue;\n    for (int u = 1; u < n; u++)\n        res = Math.Min(res, dp[full, u] + dist[u, 0]);\n    return res;\n}",
      },
    ],
  },
];
