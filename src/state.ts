import { type AppBookDatabaseState } from './database_access'
import { type AppWarehouseDatabaseState } from './warehouse/warehouse_database'

export interface AppState extends AppBookDatabaseState, AppWarehouseDatabaseState {}
