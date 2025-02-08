"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import IndividualCabinForm from "./components/individual-cabin-form";
import CoworkingSpaceForm from "./components/coworking-space-form";
import MeetingRoomForm from "./components/meeting-room-form";
import BioFacilitiesForm from "./components/bio-facilities-form";
import ManufacturingForm from "./components/manufacturing-form";
import PrototypingLabForm from "./components/prototyping-lab-form";
import SaasLabForm from "./components/saas-lab-form";
import SoftwareForm from "./components/software-form";
import RawOfficeForm from "./components/raw-office-form";
import RawLabForm from "./components/raw-lab-form";

export default function AddNewFacility() {
  const [activeTab, setActiveTab] = useState("individual-cabin");

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Facilities</h1>
        <p className="text-sm text-gray-500">We are glad to see you again</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 gap-4 bg-transparent h-auto">
          {[
            { id: "individual-cabin", label: "Individual Cabins" },
            { id: "coworking-space", label: "Co Working Spaces" },
            { id: "bio-facilities", label: "Bio & Allied Facilities" },
            { id: "manufacturing", label: "Manufacturing Facilities" },
            { id: "prototyping", label: "Prototyping Labs" },
            { id: "saas-labs", label: "SAAS Labs & Facilities" },
            { id: "software", label: "Specialised Softwares" },
            { id: "raw-office", label: "Raw Space - Office Setup" },
            { id: "raw-lab", label: "Raw Space - Lab Setup" },
            { id: "meeting-room", label: "Meeting/Board Rooms" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="px-4 py-2 bg-white border rounded-lg shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-8">
          <TabsContent value="individual-cabin">
            <IndividualCabinForm />
          </TabsContent>
          <TabsContent value="coworking-space">
            <CoworkingSpaceForm />
          </TabsContent>
          <TabsContent value="meeting-room">
            <MeetingRoomForm />
          </TabsContent>
          <TabsContent value="bio-facilities">
            <BioFacilitiesForm />
          </TabsContent>
          <TabsContent value="manufacturing">
            <ManufacturingForm />
          </TabsContent>
          <TabsContent value="prototyping">
            <PrototypingLabForm />
          </TabsContent>
          <TabsContent value="saas-labs">
            <SaasLabForm />
          </TabsContent>
          <TabsContent value="software">
            <SoftwareForm />
          </TabsContent>
          <TabsContent value="raw-office">
            <RawOfficeForm />
          </TabsContent>
          <TabsContent value="raw-lab">
            <RawLabForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 