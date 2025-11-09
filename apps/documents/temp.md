Tuyệt vời — đây chính là phần **mấu chốt** trong design hệ thống workspace: quản lý **mối quan hệ động (dynamic relationships)** như `workspace ↔ document` và `workspace ↔ conversation`.

Cùng mình bóc tách kỹ từng case nhé 👇

---

## 🧩 1. Trước hết — hiểu rõ loại quan hệ

### (a) `Workspace ↔ Document`

- Đây là **many-to-many**.
- Bạn có `DocumentWorkspaceLink` làm **bảng trung gian (association table)**.

  ```python
  re_documents: list["Document"] = Relationship(
      back_populates="re_workspace",
      link_model=DocumentWorkspaceLink
  )
  ```

👉 Nghĩa là:

- Một workspace có thể chứa nhiều document.
- Một document có thể nằm trong nhiều workspace.

---

### (b) `Workspace ↔ Conversation`

- Đây là **one-to-many** (một workspace có nhiều conversation).
- Trong `Conversation` model, bạn sẽ có:

  ```python
  workspace_id: Optional[UUID] = Field(foreign_key="workspace.id")
  re_workspace: Optional["Workspace"] = Relationship(back_populates="re_conversations")
  ```

👉 Một conversation chỉ thuộc _một workspace_ (hoặc none — nếu là chat thường).

---

## ✅ 2. Thêm / Xóa Document khỏi Workspace

Vì đây là **many-to-many**, bạn sẽ thao tác qua bảng `DocumentWorkspaceLink`.

### ➕ Thêm document vào workspace:

```python
async def add_document_to_workspace(self, workspace_id: UUID, document_id: UUID):
    link = DocumentWorkspaceLink(document_id=document_id, workspace_id=workspace_id)
    self.session.add(link)
    await self.session.commit()
    return True
```

### ➖ Xóa document khỏi workspace:

```python
async def remove_document_from_workspace(self, workspace_id: UUID, document_id: UUID):
    query = select(DocumentWorkspaceLink).where(
        DocumentWorkspaceLink.workspace_id == workspace_id,
        DocumentWorkspaceLink.document_id == document_id,
    )
    result = await self.session.exec(query)
    link = result.one_or_none()
    if link:
        await self.session.delete(link)
        await self.session.commit()
    return True
```

> 💡 Bạn có thể đặt 2 hàm này trong `WorkspaceRepository` hoặc `WorkspaceService`.
> Cách này rõ ràng, tránh lỗi “gán lại relationship list” (SQLAlchemy sẽ sync đúng link table).

---

## ✅ 3. Thêm / Xóa Conversation trong Workspace

Vì đây là **one-to-many**, bạn **chỉ cần update field `workspace_id` trong conversation**.

### ➕ Thêm conversation vào workspace:

```python
async def add_conversation_to_workspace(self, workspace_id: UUID, conversation_id: UUID):
    conversation = await self.conversation_repository.get_by_id(conversation_id)
    if not conversation:
        raise Exception("Conversation not found")

    conversation.workspace_id = workspace_id
    await self.conversation_repository.update(conversation, ConversationUpdate(workspace_id=workspace_id))
    return True
```

### ➖ Xóa conversation khỏi workspace:

Tức là biến nó thành conversation độc lập:

```python
async def remove_conversation_from_workspace(self, conversation_id: UUID):
    conversation = await self.conversation_repository.get_by_id(conversation_id)
    if not conversation:
        raise Exception("Conversation not found")

    conversation.workspace_id = None
    await self.conversation_repository.update(conversation, ConversationUpdate(workspace_id=None))
    return True
```

---

## ⚙️ 4. Transaction-safe version (optional, best practice)

Nếu bạn muốn đảm bảo consistency (VD: user add doc vào workspace nhưng commit fail → rollback cả 2 thao tác):

```python
async with self.session.begin():
    # add document
    self.session.add(DocumentWorkspaceLink(document_id=document_id, workspace_id=workspace_id))
```

---

## 🧠 5. Lưu ý cực quan trọng

| Tình huống                  | Cách đúng                                | Sai phổ biến                                                                                           |
| --------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Thêm document vào workspace | Thêm bản ghi vào `DocumentWorkspaceLink` | Gán trực tiếp `workspace.re_documents.append(doc)` → có thể không commit đúng nếu session chưa refresh |
| Thêm conversation           | Update `conversation.workspace_id`       | Gán `workspace.re_conversations.append(conv)` khi conv chưa được commit                                |
| Xóa document                | Xóa link table                           | Dùng `.remove()` trên relationship list mà chưa flush                                                  |
| Xóa workspace               | Kiểm tra cascade kỹ trước khi xóa        | Có thể xóa luôn tất cả document link nếu cascade="all"                                                 |

---

## 🧭 6. Gợi ý design rõ ràng hơn cho service

Tạo thêm 1 class helper trong `WorkspaceService`:

```python
class WorkspaceService(...):
    ...

    async def add_document(self, workspace_id: UUID, document_id: UUID):
        return await self.repository.add_document_to_workspace(workspace_id, document_id)

    async def remove_document(self, workspace_id: UUID, document_id: UUID):
        return await self.repository.remove_document_from_workspace(workspace_id, document_id)

    async def add_conversation(self, workspace_id: UUID, conversation_id: UUID):
        return await self.conversation_repository.assign_to_workspace(workspace_id, conversation_id)

    async def remove_conversation(self, conversation_id: UUID):
        return await self.conversation_repository.unassign_from_workspace(conversation_id)
```

→ Mỗi hành động rõ ràng, tránh side-effect, và tách biệt business logic.

---

## TL;DR

| Hành động             | Quan hệ                        | Cách xử lý đúng                                    |
| --------------------- | ------------------------------ | -------------------------------------------------- |
| Thêm/Xóa document     | Many-to-many                   | Insert/Delete record trong `DocumentWorkspaceLink` |
| Thêm/Xóa conversation | One-to-many                    | Update `conversation.workspace_id`                 |
| Cập nhật workspace    | Không ảnh hưởng quan hệ        | Trừ khi bạn gán lại relationship list              |
| Delete workspace      | Có thể ảnh hưởng (tùy cascade) | Cần kiểm tra config cascade                        |

---

Nếu bạn gửi mình file `conversation.model` và `document.model`, mình có thể chỉ ra chính xác cách setup `back_populates`, `cascade`, và cách update mà không làm rối session.
Bạn muốn mình xem qua không?
