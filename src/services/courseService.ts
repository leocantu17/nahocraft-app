/**
 * Servicio de Cursos e Inscripciones de Alumnos (RPC Atómico)
 * Módulo desacoplado de Supabase (PostgreSQL + RLS + RPC)
 */

import { supabase, isSupabaseConfigured } from '../lib/conexion';
import type { CourseItem, CourseEnrollment } from '../types';

// =============================================================================
// COURSES
// =============================================================================

export async function fetchCourses(): Promise<CourseItem[] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('event_date', { ascending: true });

  if (error || !data) return null;

  return data.map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    eventDate: c.event_date,
    eventDateDisplay: c.event_date_display,
    eventTimeDisplay: c.event_time_display,
    registrationDeadline: c.registration_deadline,
    maxSpots: c.max_spots,
    enrolledCount: c.enrolled_count,
    price: Number(c.price),
    modality: c.modality as CourseItem['modality'],
    platformName: c.platform_name,
    meetingLink: c.meeting_link,
    image: c.image,
    monthLabel: c.month_label,
    level: c.level,
    includes: c.includes || [],
    featured: c.featured,
    active: c.active,
  }));
}

export async function upsertCourse(course: CourseItem): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('courses').upsert({
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    event_date: course.eventDate,
    event_date_display: course.eventDateDisplay,
    event_time_display: course.eventTimeDisplay,
    registration_deadline: course.registrationDeadline,
    max_spots: course.maxSpots,
    enrolled_count: course.enrolledCount,
    price: course.price,
    modality: course.modality,
    platform_name: course.platformName,
    meeting_link: course.meetingLink,
    image: course.image,
    month_label: course.monthLabel,
    level: course.level,
    includes: course.includes,
    featured: Boolean(course.featured),
    active: course.active !== false,
  });
  return !error;
}

export async function deleteCourseFromDb(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('courses').delete().eq('id', id);
  return !error;
}

// =============================================================================
// COURSE ENROLLMENTS
// =============================================================================

export async function fetchCourseEnrollments(): Promise<CourseEnrollment[] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return null;

  return data.map((e) => ({
    id: e.id,
    folio: e.folio,
    accessCode: e.access_code,
    lockedSessionId: e.locked_session_id || undefined,
    courseId: e.course_id,
    courseTitle: e.course_title,
    courseDateDisplay: e.course_date_display,
    courseTimeDisplay: e.course_time_display,
    meetingLink: e.meeting_link,
    platformName: e.platform_name,
    buyerName: e.buyer_name,
    buyerEmail: e.buyer_email,
    buyerPhone: e.buyer_phone,
    ticketsCount: 1,
    totalPaid: Number(e.total_paid),
    paymentMethod: e.payment_method as CourseEnrollment['paymentMethod'],
    purchasedAt: e.purchased_at,
    emailSentToBuyer: e.email_sent_to_buyer,
    emailSentToNaho: e.email_sent_to_naho,
  }));
}

/**
 * Inscribe a un estudiante usando la función RPC atómica de PostgreSQL
 * para garantizar que nunca se sobrepase el cupo máximo
 */
export async function registerEnrollmentAtomic(enrollment: CourseEnrollment): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { error } = await supabase.rpc('register_course_enrollment', {
    p_id: enrollment.id,
    p_folio: enrollment.folio,
    p_access_code: enrollment.accessCode,
    p_course_id: enrollment.courseId,
    p_course_title: enrollment.courseTitle,
    p_course_date_display: enrollment.courseDateDisplay,
    p_course_time_display: enrollment.courseTimeDisplay,
    p_meeting_link: enrollment.meetingLink,
    p_platform_name: enrollment.platformName,
    p_buyer_name: enrollment.buyerName,
    p_buyer_email: enrollment.buyerEmail,
    p_buyer_phone: enrollment.buyerPhone,
    p_total_paid: enrollment.totalPaid,
    p_payment_method: enrollment.paymentMethod,
    p_purchased_at: enrollment.purchasedAt,
    p_email_sent_to_buyer: enrollment.emailSentToBuyer,
    p_email_sent_to_naho: enrollment.emailSentToNaho,
  });

  return !error;
}

export async function deleteEnrollmentAtomic(enrollmentId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.rpc('delete_course_enrollment', {
    p_enrollment_id: enrollmentId,
  });
  return !error;
}

export async function updateEnrollmentSession(enrollmentId: string, sessionId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase
    .from('course_enrollments')
    .update({ locked_session_id: sessionId })
    .eq('id', enrollmentId);
  return !error;
}

