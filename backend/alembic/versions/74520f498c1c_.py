"""empty message

Revision ID: 74520f498c1c
Revises: 
Create Date: 2026-11-15 07:23:38.558676

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '74520f498c1c'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
   
    op.add_column('users', sa.Column('phone_number', sa.String(), nullable=False))
    


def downgrade():
   
    op.drop_column('users', 'phone_number')
