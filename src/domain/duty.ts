import getDbConnection from '../data-access/db-connection';

export async function addDuty(name: string) {
  const dbConnection = getDbConnection();
  const data = await dbConnection.query(
    `
    insert into duty (name) values ($1) returning id, name, is_completed
  `,
    [name]
  );

  return data.rows?.[0];
}

export async function getDutyById(id: string) {
  const dbConnection = getDbConnection();
  const data = await dbConnection.query(
    `
    select * from duty where id = $1
  `,
    [id]
  );

  return data.rows?.[0];
}

export async function getDuties() {
  const dbConnection = getDbConnection();
  const data = await dbConnection.query(
    `
    select id, name, is_completed from duty
  `
  );

  return data.rows;
}

export async function updateDutyById(
  id: string,
  data: { name: string; is_completed: boolean }
) {
  const dbConnection = getDbConnection();
  const resp = await dbConnection.query(
    `
      update duty
      set name = $1, is_completed = $2
      where id = $3
      returning id, name, is_completed
    `,
    [data.name, data.is_completed, id]
  );

  return resp.rows?.[0];
}

export async function deleteDutyById(id: string) {
  const dbConnection = getDbConnection();
  const data = await dbConnection.query(
    `
    delete from duty where id = $1
  `,
    [id]
  );

  if (data.rowCount !== 1) {
    throw new Error(`failed to delete duty with id: ${id}`);
  }

  return data;
}
