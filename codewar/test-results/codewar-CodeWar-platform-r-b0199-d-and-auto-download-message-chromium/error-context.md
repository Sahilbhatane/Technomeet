# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - heading "CodeWar Competition" [level=1] [ref=e4]
    - paragraph [ref=e5]: TechnoMeet 2K26
  - generic [ref=e7]:
    - heading "Competition Rounds" [level=2] [ref=e8]
    - paragraph [ref=e9]: "Start with Round 1: MCQ Quiz"
    - generic [ref=e10]:
      - generic [ref=e11]:
        - 'heading "Round 1: MCQ Quiz" [level=3] [ref=e12]'
        - paragraph [ref=e13]: 20 questions, 25 minutes
        - button "Start MCQ Round" [ref=e14] [cursor=pointer]
      - generic [ref=e15]:
        - 'heading "Round 2: Debug Code" [level=3] [ref=e16]'
        - paragraph [ref=e17]: Debug faulty programs, 45 minutes
        - button "Complete MCQ first" [disabled] [ref=e18] [cursor=pointer]
      - generic [ref=e19]:
        - 'heading "Round 3: Problem Statement" [level=3] [ref=e20]'
        - paragraph [ref=e21]: Solve coding problems, 60 minutes
        - button "Complete Debug first" [disabled] [ref=e22] [cursor=pointer]
  - paragraph [ref=e23]:
    - 'link "Invigilator: Collect all result files" [ref=e24] [cursor=pointer]':
      - /url: collect_results.html
```