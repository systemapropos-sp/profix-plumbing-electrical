import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function GpsTrackingPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
    fetchJobs();
  }, []);

  async function fetchEmployees() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('gps_tracking_enabled', true)
      .in('role', ['plumber', 'electrician'])
      .eq('status', 'active');
    setEmployees(data || []);
  }

  async function fetchJobs() {
    const { data } = await supabase
      .from('jobs')
      .select('*, customers(name)')
      .not('lat', 'is', null)
      .in('status', ['scheduled', 'in_progress']);
    setJobs(data || []);
  }

  const center: [number, number] = [25.7617, -80.1918];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">GPS Tracking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="h-[500px] overflow-hidden">
            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {employees.map((emp) =>
                emp.current_location_lat && emp.current_location_lng ? (
                  <Marker
                    key={emp.id}
                    position={[emp.current_location_lat, emp.current_location_lng]}
                    icon={defaultIcon}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold">{emp.full_name}</p>
                        <p className="capitalize text-xs text-muted-foreground">{emp.role}</p>
                        <p className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {emp.last_location_update ? new Date(emp.last_location_update).toLocaleTimeString() : 'N/A'}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )}
              {jobs.map((job) =>
                job.lat && job.lng ? (
                  <Marker
                    key={`job-${job.id}`}
                    position={[job.lat, job.lng]}
                    icon={L.divIcon({
                      className: 'custom-div-icon',
                      html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                      iconSize: [12, 12],
                      iconAnchor: [6, 6],
                    })}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.customers?.name}</p>
                        <p className="text-xs text-muted-foreground">{job.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>
          </Card>
        </div>

        <div className="space-y-3">
          <Card>
            <CardHeader><CardTitle className="text-sm">Empleados Activos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedEmployee === emp.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedEmployee(emp.id === selectedEmployee ? null : emp.id)}
                >
                  <div className={`w-2 h-2 rounded-full ${emp.current_location_lat ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{emp.full_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{emp.role}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {emp.last_location_update ? 'Activo' : 'Offline'}
                  </Badge>
                </div>
              ))}
              {employees.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No hay empleados con GPS activo</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Trabajos en Mapa</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.customers?.name}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">{job.status}</Badge>
                </div>
              ))}
              {jobs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No hay trabajos con ubicación</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
