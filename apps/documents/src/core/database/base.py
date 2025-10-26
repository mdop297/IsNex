from sqlmodel import SQLModel


class BaseTable(SQLModel, table=False):
    pass
