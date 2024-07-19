"""empty message

Revision ID: 726558d79770
Revises: 
Create Date: 2024-07-18 20:03:02.361133

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '726558d79770'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password', sa.String(length=250), nullable=False))
        batch_op.alter_column('firstName',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=100),
               nullable=False)
        batch_op.alter_column('DOB',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)

    with op.batch_alter_table('staff', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_active', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('staff', schema=None) as batch_op:
        batch_op.drop_column('is_active')

    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.alter_column('DOB',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=100),
               nullable=True)
        batch_op.alter_column('firstName',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)
        batch_op.drop_column('password')

    # ### end Alembic commands ###
