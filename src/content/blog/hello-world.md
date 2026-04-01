---
title: "Hello, World!"
description: "Welcome to my blog. I'll be writing about software development, machine learning, and everything in between."
pubDate: 2026-03-24
tags: ["meta", "introduction"]
---

Welcome to my blog! I'm Mateo, a software developer and ML engineer. This is where I'll share my thoughts on technology, projects I'm working on, and things I've learned along the way.

## What to expect

I plan to write about a variety of topics:

- **Software engineering** — architecture patterns, developer tools, and lessons from building production systems
- **Machine learning** — practical ML, model training, and deploying models in the real world
- **Side projects** — breakdowns of things I'm building and the technical decisions behind them

## Why a blog?

Writing helps me think more clearly. When I have to explain a concept well enough to put it in a post, I understand it much better myself. Plus, if something I write helps even one person solve a problem, that's a win.

## A quick code example

Here's a simple Python snippet, just to make sure syntax highlighting works:

```python
def fibonacci(n: int) -> list[int]:
    if n <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]

print(fibonacci(10))
```

## What's next

Stay tuned for more posts. If you want to get in touch, feel free to reach out via [email](mailto:hey@mateowang.dev) or find me on [GitHub](https://github.com/SwiftWinds).
