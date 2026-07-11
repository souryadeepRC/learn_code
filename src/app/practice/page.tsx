'use client';

import { AuthGuard } from '@/components/common/AuthGuard';
import { Content } from '@/components/common/Content';
import { Heading } from '@/components/common/Heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RiCodeBoxLine, RiTerminalBoxLine, RiTrophyLine } from 'react-icons/ri';

const PRACTICE_TOPICS = [
  {
    id: 'algo-1',
    title: 'Advanced Data Structures & Algorithms',
    description:
      'Master graphs, dynamic programming, and complex tree algorithms with real-time feedback.',
    level: 'Hard',
    questionsCount: 45,
    completedCount: 12,
  },
  {
    id: 'sys-design',
    title: 'System Design Drills',
    description:
      'Architect scalable distributed systems, caching layers, and database sharding schemas.',
    level: 'Expert',
    questionsCount: 20,
    completedCount: 5,
  },
  {
    id: 'conc-ts',
    title: 'TypeScript & React Concurrency',
    description:
      'Deep dive into async rendering, custom hooks memory optimization, and server actions.',
    level: 'Medium',
    questionsCount: 30,
    completedCount: 18,
  },
];

const PracticePage = () => {
  return (
    <AuthGuard requiredAccess="premium">
      <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heading variant="h2">Pro Practice Arena</Heading>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold border-none">
                  PRO FEATURE
                </Badge>
              </div>
              <Content size="sm" className="text-muted-foreground">
                Exclusive hands-on coding environments and architectural drills
                for premium members.
              </Content>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <RiTrophyLine className="h-4 w-4 text-amber-500" />
                Leaderboard
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRACTICE_TOPICS.map((topic) => (
              <Card
                key={topic.id}
                className="flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge
                      variant={
                        topic.level === 'Hard' || topic.level === 'Expert'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {topic.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">
                      {topic.completedCount} / {topic.questionsCount} solved
                    </span>
                  </div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <RiTerminalBoxLine className="h-5 w-5 text-primary shrink-0" />
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {topic.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{
                        width: `${Math.round((topic.completedCount / topic.questionsCount) * 100)}%`,
                      }}
                    />
                  </div>
                  <Button className="w-full gap-2 font-medium">
                    <RiCodeBoxLine className="h-4 w-4" />
                    Launch Arena
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </AuthGuard>
  );
};

export default PracticePage;
