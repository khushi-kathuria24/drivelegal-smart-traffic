'use client'

import React, { useState } from 'react'
import { FileText, Upload, Download, Share2, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { documents } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'

export default function DocumentsPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    return status === 'valid'
      ? 'success'
      : status === 'expiring'
      ? 'warning'
      : 'danger'
  }

  const getStatusIcon = (status: string) => {
    return status === 'valid' ? (
      <CheckCircle size={16} className="text-success-600" />
    ) : (
      <AlertCircle size={16} className="text-warning-600" />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vehicle Documents</h1>
        <p className="mt-1 text-dark-600 dark:text-dark-400">
          Manage and track your vehicle documents and certifications
        </p>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-primary-300 dark:border-primary-700">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <Upload size={32} className="text-primary-600" />
            <div className="text-center">
              <p className="font-semibold">Upload New Document</p>
              <p className="text-xs text-dark-600 dark:text-dark-400">
                License, Registration, Insurance, Pollution Certificate, etc.
              </p>
            </div>
            <Button>
              <Upload size={16} />
              Choose File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Status Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Total Documents</p>
            <p className="mt-2 text-3xl font-bold">{documents.length}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Valid Documents</p>
            <p className="mt-2 text-3xl font-bold text-success-600">
              {documents.filter((d) => d.status === 'valid').length}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Expiring Soon</p>
            <p className="mt-2 text-3xl font-bold text-warning-600">
              {documents.filter((d) => d.status === 'expiring').length}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Action Needed</p>
            <p className="mt-2 text-3xl font-bold text-danger-600">
              {documents.filter((d) => d.status === 'expired').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            interactive
            onClick={() => setSelectedFile(doc.id)}
            className={selectedFile === doc.id ? 'border-primary-600' : ''}
          >
            <CardContent className="py-4">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-dark-100 p-3 dark:bg-dark-700">
                  <FileText size={24} className="text-primary-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{doc.name}</h3>
                    <Badge variant={getStatusBadge(doc.status)}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-dark-600 dark:text-dark-400">
                    <p>Type: {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</p>
                    <p>
                      Uploaded: {formatDate(doc.uploadedDate)}
                      {doc.expiryDate && ` • Expires: ${formatDate(doc.expiryDate)}`}
                    </p>
                  </div>

                  {doc.expiryDate && new Date(doc.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-warning-600">
                      <AlertCircle size={14} />
                      Renewal recommended soon
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" icon={<Download size={14} />}>
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Share2 size={14} />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Categories */}
      <Card>
        <CardHeader
          title="Document Requirements"
          subtitle="Essential documents for vehicle owners"
        />
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: 'Driving License',
                validity: '10 years',
                renewal: 'At RTO',
                status: 'valid',
              },
              {
                type: 'Vehicle Registration (RC)',
                validity: '15 years',
                renewal: 'At RTO',
                status: 'valid',
              },
              {
                type: 'Insurance Certificate',
                validity: '1 year',
                renewal: 'Online or Agent',
                status: 'valid',
              },
              {
                type: 'Pollution Certificate',
                validity: '1-2 years',
                renewal: 'At Test Center',
                status: 'expiring',
              },
              {
                type: 'Fitness Certificate (Commercial)',
                validity: '1 year',
                renewal: 'At RTA',
                status: 'valid',
              },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-dark-200 p-3 dark:border-dark-700"
              >
                <div>
                  <p className="font-medium">{doc.type}</p>
                  <div className="mt-1 flex gap-2 text-xs text-dark-600 dark:text-dark-400">
                    <span>Validity: {doc.validity}</span>
                    <span>•</span>
                    <span>Renewal: {doc.renewal}</span>
                  </div>
                </div>
                {getStatusIcon(doc.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
