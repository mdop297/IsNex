# documents

Project description here.

notation crows-foot
colorMode pastel
typeface mono
User [icon: user, color: blue] {
id UUID pk
displayName string
role string
email Email
hashedPassword string
createdAt datetime
updatedAt datetime
}

Folder [color: Purple] {
id UUID pk
parentId Folder [ref]
ownerId User [ref, required]
name string
path string
createdAt datetime
updatedAt datetime
}

Document [color: Blue] {
id UUID pk
ownerId User [ref, required]
folderId Folder [ref]
workspaceId Workspace [ref]
name string
status enum('pending', 'success',' failed')
summary text [optional]
fileUrl string
numPages integer
metadata JSONB
createdAt datetime
updatedAt datetime
deletedAt datetime
}

Workspace [color: Purple] {
id UUID pk
ownerId User [ref, required]
name string
icon string
description text
activeConv Conversation [ref, optional]
activeDoc Document [ref, optional]
activeNote Note [ref, optional]
createdAt datetime
updatedAt datetime
}

DocumentWorkspaceLink [color: Yellow] {
documentId Document [ref, required]
workspaceId Workspace [ref, required]
createdAt datetime
}

Note [color: Red] {
id UUID pk
parentId Note [ref]
ownerId User [ref, required]
title string
icon string
favorite bool
createdAt datetime
updatedAt datetime
deletedAt datetime optional
}

NoteBlock [color: Orange] {
id UUID pk
noteId Note [ref, required]
parentId NoteBlock [ref]
type enum('text', 'heading', etc)
props JSONB
content JSONB
order integer
updatedAt datetime
}

BlockSourceLink [color: Red] {
sourceId Source [ref, required]
createdAt datetime
blockId NoteBlock [ref, required]
}

Source [color: Blue] {
id UUID pk
type enum('highlight', 'web', 'note')
highlightId Highlight [ref, optional]  
 noteId NoteBlock [ref, optional]  
 url string optional
contentPreview text optional
createdAt datetime
}

Highlight [color: Red] {
id UUID pk
ownerId User [ref, required]
documentId Document [ref, required]
type enum('text','area')
color string
contentPreview text optional
content JSONB
position JSONB
createdAt datetime
}

Conversation [color: Yellow] {
id UUID pk
workspaceId Workspace [ref]
ownerId User [ref, required]
title string optional
createdAt datetime
updatedAt datetime
}

Message [color: Green] {
id UUID pk
ownerId User [ref, optional]
convId Conversation [ref, required]
senderType enum('user','model')
modelName string optional
content string
reaction enum('like', 'dislike') null
createdAt datetime
regenerated bool optional
}

Prompt [color: Orange] {
id UUID pk
ownerId User [ref, optional]
workspaceId Workspace [ref, optional]
name string
content text
type enum('system', 'workspace', 'user', 'common')
createdAt datetime
updatedAt datetime
}

PersonalContext [color: Purple] {
id UUID pk
userId User [ref, required]
content string  
}

User.id < Document.ownerId
User.id < Conversation.ownerId
User.id < Workspace.ownerId
User.id < Message.ownerId
User.id < Highlight.ownerId
User.id < Note.ownerId
User.id < Folder.ownerId
User.id < Prompt.ownerId
User.id < PersonalContext.userId

Prompt.workspaceId - Workspace.id
Folder.id < Document.folderId
Folder.id < Folder.parentId

Note.id < Note.parentId
NoteBlock.id < BlockSourceLink.blockId

Note.id < NoteBlock.noteId
Note.id - Workspace.activeNote

Source.highlightId - Highlight.id
BlockSourceLink.sourceId > Source.id
NoteBlock.id - Source.noteId

Document.id < Highlight.documentId
Document.id < DocumentWorkspaceLink.documentId
DocumentWorkspaceLink.workspaceId > Workspace.id
Document.id - Workspace.activeDoc

Conversation.id < Message.convId
Conversation.workspaceId > Workspace.id
Conversation.id - Workspace.activeConv
