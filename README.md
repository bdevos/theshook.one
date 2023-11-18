# theshook.one

Project to list articles from theverge.com by aggregating their RSS feeds for different categories / tags.

## Usage

Start the project:

```
deno task start
```

Update the KV store with latest feed updates:

```
deno task updateEntries
```

Delete all entries from KV store:

```
deno task deleteEntries
```
