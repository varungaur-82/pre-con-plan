import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Calendar } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { NewProjectModal } from "@/components/NewProjectModal";
import { useState } from "react";

export function ProjectsPage() {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  return (
    <PageLayout>
      <NewProjectModal open={showNewProjectModal} onOpenChange={setShowNewProjectModal} />
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage all your construction projects</p>
        </div>
        <Button 
          className="gap-2 bg-gradient-to-r from-construction-primary to-construction-secondary"
          onClick={() => setShowNewProjectModal(true)}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-construction-primary" />
                <CardTitle className="text-lg">Project {i}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Construction project description and details...
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Jan 2024 - Dec 2024</span>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    </PageLayout>
  );
}