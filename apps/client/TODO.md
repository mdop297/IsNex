render folder structure.

1. load data

- load folders
- load files

2. filtered rendering

```python
class Folder:
    id: UUID
    parent_id: Optional[UUID] = None
    name: str
    path: str
    updated_at: datetime

def render_items(folders, parent_id=none, level=0):
  current_level_folders = filter(lambda x: x.parent_id == parent_id, folders):
  for folder in current_level_folders:
    render_tsx_component(folder)
    render_items(folders, parent_id = folder.id, level=level+1)

```

- optimized version:

```python
from collections import defaultdict

class Folder:
    id: UUID
    parent_id: Optional[UUID] = None
    name: str
    path: str
    updated_at: datetime

def build_tree_map(folders:Folder):
  tree = defaultdict(list) # => {key: value with type list}
  for f in folders:
    tree[f.parent_id].append(f)
  return tree

def build_document_tree_map:
  tree = defaultdict(list)
  for d in documents:
    tree[d.folder_id].append(d)
  return tree

# output of build_tree_map: {
#     None: [Folder(id=1, "Root A"), Folder(id=2, "Root B")],
#     1: [Folder(id=3, "Child A1"), Folder(id=4, "Child A2")],
#     3: [Folder(id=5, "Grandchild A1.1")],
#     4: [],  # Nếu không có con, truy cập vẫn trả về list()
#     ...
# }

def render_items(folder_tree, documents_tree, parent_id=none, level=0):
  for folder in tree.get(parent_id, []):
    render_tsx_component(folder, level)
    for doc in documents_tree.get(folder.id, []):
        render_document_items(doc, level + 1)
    render_items(tree, parent_id=folder.id, level=level+1)

```

- object/components
  core database,
  vector database,
  uploaded documents,
  retriever,

- flow:

  - user upload document to isnex
  - core service
    - store file in object storage
    - store metadata in core database
  - data processing service get document object and process it
  - process document by ... -> store chunks and embedding vectors in vector database

  - user ask question
  - send question to chat route (but which service is responsible for this route? let's call X)
  - X service will decide which tools to use, if the model think it should use retriever tool to get information in vector database.
  - Y service retrieve vectors from vector db to fetch into llm prompt (how?)
  - after fetching vector, how to send back to X or send to llm-provider/llm-inference service to fetch event
