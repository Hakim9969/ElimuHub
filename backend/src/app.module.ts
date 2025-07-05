import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ContentModule } from './content/content.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ProgressModule } from './progress/progress.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CertificatesModule } from './certificates/certificates.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { MessagesModule } from './messages/messages.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UserService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { LessonModule } from './lesson/lesson.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, CoursesModule, ContentModule, EnrollmentModule, ProgressModule, QuizzesModule, ReviewsModule, CertificatesModule, AnnouncementsModule, MessagesModule, AnalyticsModule, LessonModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UserService],
})
export class AppModule {}
