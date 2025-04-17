import {
	format,
	parseISO,
	addHours,
	differenceInHours,
	isBefore,
} from 'date-fns'
import { ScheduleItem } from '../types/schedule'
import styles from '../styles/schedule.module.css'

interface ScheduleClassProps {
	item: ScheduleItem
}

const ScheduleClass = ({ item }: ScheduleClassProps) => {
	const { schedule, queue } = item

	// Format time as "13:30 - 15:05"
	const timeRange = `${format(
		parseISO(schedule.StartTime),
		'HH:mm'
	)} - ${format(parseISO(schedule.EndTime), 'HH:mm')}`

	// Check if queue is available
	const hasQueue = queue !== undefined

	// Calculate time until queue opens (28 hours before class)
	const queueOpenTime = hasQueue
		? parseISO(queue.OpensAt)
		: addHours(parseISO(schedule.StartTime), -28)

	const now = new Date()
	const hoursUntilQueueOpens = differenceInHours(queueOpenTime, now)
	const isQueueOpen = hasQueue && queue.IsActive
	const isQueueNotYetOpen =
		hasQueue && !queue.IsActive && isBefore(now, queueOpenTime)

	return (
		<div className={styles.classCard}>
			<div className={styles.classHeader}>
				<h3 className={styles.className}>{schedule.Name}</h3>
				<span className={styles.classTime}>{timeRange}</span>
			</div>

			<div className={styles.classDetails}>
				{hasQueue && (
					<div className={styles.queueInfo}>
						{isQueueOpen && (
							<button className={styles.joinQueueButton}>
								Присоединиться к очереди
							</button>
						)}

						{isQueueNotYetOpen && (
							<div className={styles.queueCountdown}>
								Очередь откроется через {hoursUntilQueueOpens} ч.
							</div>
						)}

						{!isQueueOpen && !isQueueNotYetOpen && (
							<div className={styles.queueClosed}>Очередь закрыта</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default ScheduleClass
