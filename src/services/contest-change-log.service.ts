import { ContestChangeLog } from '../entities/contest-change-log.entity.js';
import { Contest } from '../entities/contest.entity.js';

/**
 * Service to handle contest change logs
 */
export class ContestChangeLogService {
  /**
   * Log changes made to a contest
   * @param contestId ID of the contest being modified
   * @param userId ID of the user making the changes
   * @param changes Array of changes containing key, prevValue and newValue
   * @param description Optional description of the changes
   * @returns The created change log entry
   */
  static async logChanges(
    contestId: string,
    userId: string,
    changes: Array<{
      key: string;
      prevValue: any;
      newValue: any;
      field?: string;
    }>,
    description?: string,
  ): Promise<ContestChangeLog> {
    try {
      // Check if contest exists
      const contest = await Contest.findByPk(contestId);
      if (!contest) {
        throw new Error(`Contest with ID ${contestId} not found`);
      }

      // Create new change log entry
      const changeLog = await ContestChangeLog.create({
        contestId,
        userId,
        changes,
        description,
      });

      return changeLog;
    } catch (error) {
      console.error('Error logging contest changes:', error);
      throw error;
    }
  }

  /**
   * Get change logs for a specific contest
   * @param contestId ID of the contest
   * @param limit Maximum number of logs to return
   * @param offset Offset for pagination
   * @returns Array of change logs
   */
  static async getContestChangeLogs(
    contestId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<{ logs: ContestChangeLog[]; total: number }> {
    try {
      const { rows, count } = await ContestChangeLog.findAndCountAll({
        where: { contestId },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        logs: rows,
        total: count,
      };
    } catch (error) {
      console.error('Error fetching contest change logs:', error);
      throw error;
    }
  }

  /**
   * Get a specific change log by ID
   * @param logId ID of the change log
   * @returns The change log entry
   */
  static async getChangeLogById(logId: string): Promise<ContestChangeLog> {
    try {
      const log = await ContestChangeLog.findByPk(logId);
      if (!log) {
        throw new Error(`Change log with ID ${logId} not found`);
      }
      return log;
    } catch (error) {
      console.error('Error fetching change log:', error);
      throw error;
    }
  }

  /**
   * Get change logs by user ID
   * @param userId ID of the user
   * @param limit Maximum number of logs to return
   * @param offset Offset for pagination
   * @returns Array of change logs
   */
  static async getUserChangeLogs(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<{ logs: ContestChangeLog[]; total: number }> {
    try {
      const { rows, count } = await ContestChangeLog.findAndCountAll({
        where: { userId },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        logs: rows,
        total: count,
      };
    } catch (error) {
      console.error('Error fetching user change logs:', error);
      throw error;
    }
  }
} 