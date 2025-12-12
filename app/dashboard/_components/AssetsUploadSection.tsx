"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Search, Upload, FileText, CheckCircle, AlertCircle, ArrowUpRight, ArrowUpFromLineIcon } from "lucide-react";
import { getPost } from "@/utils/post/get/action";
import * as motion from "motion/react-client";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { getSignedUrlForAssetUpload } from "@/utils/s3/action";
import { uploadFileWithProgress } from "@/utils/helpers/uploadFileWithProgress";

interface PostMetadata {
    slug: string;
    title: string;
    entryTime: string;
    classLevel?: string;
    subject?: string;
    description?: string;
}

export default function AssetsUploadSection() {
    const [step, setStep] = useState<number>(1); // 1: file selection, 2: post selection
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [assetName, setAssetName] = useState<string>("");
    const [postSlug, setPostSlug] = useState<string>("");
    const [postMetadata, setPostMetadata] = useState<PostMetadata | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            setStep(2);
            setError("");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            setFileName(file.name);
            setStep(2);
            setError("");
        } else {
            setError("Please select a PDF file");
        }
    };

    const handleSearchPost = async () => {
        if (!postSlug.trim()) {
            setError("Please enter a post slug");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const { post } = await getPost(postSlug);
            if (post) {
                setPostMetadata({
                    slug: post.slug,
                    title: post.title,
                    entryTime: post.entryTime,
                    classLevel: post.classLevel,
                    subject: post.subject,
                    description: post.description
                });
            } else {
                setError("Post not found with this slug");
            }
        } catch (err) {
            setError("Error fetching post data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!assetName.trim()) {
            setError("Please enter an asset name");
            return;
        }

        if (!selectedFile) {
            setError("No file selected");
            return;
        }

        setIsLoading(true);
        setIsUploading(true);
        setUploadProgress(0);
        setUploadComplete(false);
        setShowSuccess(false);
        setError("");

        try {
            // Get presigned URL for asset upload
            const { signedUrl, Key } = await getSignedUrlForAssetUpload(
                selectedFile.name,
                selectedFile.type
            );

            // Upload file with progress tracking
            await new Promise<void>((resolve, reject) => {
                uploadFileWithProgress({
                    file: selectedFile,
                    presignedUrl: signedUrl,
                    onProgress: (progress: number) => {
                        setUploadProgress(progress);
                    },
                    onComplete: () => {
                        setUploadComplete(true);
                        resolve();
                    },
                    onError: (err: Error) => {
                        reject(err);
                    }
                });
            });

            // Show success UI after a short delay to allow the tick animation to complete
            setTimeout(() => {
                setShowSuccess(true);
            }, 1000);
        } catch (err) {
            setError("Upload failed: " + (err as Error).message);
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setFileName("");
        setAssetName("");
        setPostSlug("");
        setPostMetadata(null);
        setStep(1);
        setError("");
        setUploadProgress(0);
        setUploadComplete(false);
        setShowSuccess(false);
        setIsUploading(false);
    };

    // Calculate the stroke dashoffset for the progress circle
    const calculateStrokeDashoffset = () => {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        return circumference - (uploadProgress / 100) * circumference;
    };

    return (
        <Card className="bg-background/70 border border-accent shadow-sm hover:shadow-md transition w-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <CardTitle className="text-base font-semibold text-foreground">
                        Upload Study Materials
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-5 py-6">
                {/* Success Animation UI */}
                {showSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="text-center py-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 20,
                                delay: 0.1
                            }}
                        >
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        </motion.div>
                        <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="text-xl font-semibold mb-2"
                        >
                            Upload Successful!
                        </motion.h3>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className="text-muted-foreground mb-6"
                        >
                            Your asset has been uploaded successfully.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                        >
                            <Button className="hover:cursor-pointer" onClick={resetForm} size="sm">
                                Upload Another
                            </Button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <>
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className="border-2 border-dashed border-violet-400 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <Upload className="w-10 h-10 text-violet-400 mx-auto mb-3" />
                                    <h3 className="font-medium mb-1">Drag & drop files here</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        or click to browse (PDF only)
                                    </p>
                                    <Button variant="outline" size="sm" className="hover:cursor-pointer">
                                        Select File
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2 text-red-500 text-sm"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </motion.div>
                                )}

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div>
                                        <p>Supported formats: PDF</p>
                                        <p>Maximum file size: 10MB</p>
                                    </div>

                                    <Link
                                        href="#"
                                        className="text-blue-400 hover:underline flex items-center"
                                    >
                                        Instructions
                                        <ArrowUpRight className="w-4 h-4 text-blue-400" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-muted/50 rounded-lg p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-8 h-8 text-blue-400 mt-1" />
                                        <div>
                                            <h4 className="font-medium truncate">{fileName}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                {selectedFile?.size ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="space-y-4"
                                >
                                    <h3 className="font-medium">Associate with Post</h3>

                                    <div className="relative">
                                        <label htmlFor="post-slug" className="text-sm font-medium text-foreground">
                                            Enter Post Slug
                                        </label>
                                        <div className="flex gap-2 mt-1">
                                            <InputGroup className="flex-1">
                                                <InputGroupInput
                                                    id="post-slug"
                                                    placeholder="Enter post slug..."
                                                    value={postSlug}
                                                    onChange={(e) => setPostSlug(e.target.value)}
                                                />
                                                <InputGroupAddon align={'inline-end'}>
                                                    <InputGroupButton
                                                        size={'icon-sm'}
                                                        onClick={handleSearchPost}
                                                        disabled={isLoading}
                                                        className="flex items-center gap-2 hover:cursor-pointer"
                                                    >
                                                        {isLoading && !isUploading ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/60 border-t-white" />
                                                        ) : (
                                                            <Search className="w-4 h-4" />
                                                        )}
                                                    </InputGroupButton>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </div>
                                    </div>

                                    {error && !isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-2 text-red-500 text-sm"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </motion.div>
                                    )}

                                    {postMetadata && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-muted/50 rounded-lg p-4 space-y-3"
                                        >
                                            <h4 className="font-medium">Post Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Title:</span>
                                                    <span className="font-medium truncate max-w-[60%]">{postMetadata.title}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Slug:</span>
                                                    <span className="truncate max-w-[60%]">{postMetadata.slug}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Created:</span>
                                                    <span>{new Date(postMetadata.entryTime).toLocaleDateString()}</span>
                                                </div>
                                                {postMetadata.classLevel && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Class:</span>
                                                        <span>{postMetadata.classLevel}</span>
                                                    </div>
                                                )}
                                                {postMetadata.subject && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Subject:</span>
                                                        <span>{postMetadata.subject}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {postMetadata && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            className="space-y-2"
                                        >
                                            <label htmlFor="asset-name" className="text-sm font-medium text-foreground">
                                                Asset Display Name
                                            </label>
                                            <Input
                                                id="asset-name"
                                                placeholder="Enter a name for this asset..."
                                                value={assetName}
                                                onChange={(e) => setAssetName(e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                This name will be displayed on the public site
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Action Buttons with Circular Progress Indicator */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="flex items-center justify-between pt-4"
                                >
                                    <Button 
                                        size={'sm'} 
                                        className="hover:cursor-pointer" 
                                        variant="outline" 
                                        onClick={() => setStep(1)}
                                        disabled={isUploading}
                                    >
                                        Back
                                    </Button>
                                    
                                    {/* Circular Progress Indicator - shown between buttons during upload */}
                                    {isUploading && (
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-16 h-16">
                                                {/* Background circle */}
                                                <svg className="w-16 h-16" viewBox="0 0 100 100">
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        fill="none"
                                                        stroke="#e5e7eb"
                                                        strokeWidth="8"
                                                    />
                                                    {/* Progress circle */}
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        fill="none"
                                                        stroke="#10b981"
                                                        strokeWidth="8"
                                                        strokeLinecap="round"
                                                        strokeDasharray="283"
                                                        strokeDashoffset={calculateStrokeDashoffset()}
                                                        transform="rotate(-90 50 50)"
                                                        className="transition-all duration-300 ease-linear"
                                                    />
                                                    
                                                    {/* Center content */}
                                                    {!uploadComplete ? (
                                                        <text
                                                            x="50"
                                                            y="50"
                                                            textAnchor="middle"
                                                            dy="7"
                                                            fontSize="16"
                                                            fontWeight="bold"
                                                            fill="#10b981"
                                                        >
                                                            {Math.round(uploadProgress)}%
                                                        </text>
                                                    ) : (
                                                        <motion.g
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ 
                                                                type: "spring", 
                                                                stiffness: 300, 
                                                                damping: 20
                                                            }}
                                                        >
                                                            <path
                                                                d="M30 50 L45 65 L70 35"
                                                                fill="none"
                                                                stroke="#10b981"
                                                                strokeWidth="8"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </motion.g>
                                                    )}
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <Button 
                                        size={'sm'} 
                                        className="hover:cursor-pointer"
                                        onClick={handleSubmit}
                                        disabled={!postMetadata || !assetName.trim() || isLoading}
                                    >
                                        {
                                            isLoading && isUploading ? (
                                                <span className="flex items-center gap-2">Uploading <Spinner className="w-4 h-4" /></span>
                                            ) : (
                                                <span className="flex items-center gap-2">Upload Asset <ArrowUpFromLineIcon className="w-4 h-4" /></span>
                                            )
                                        }
                                    </Button>
                                </motion.div>
                                
                                {/* OK Button shown when upload is complete but before success UI */}
                                {uploadComplete && !showSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 300, 
                                            damping: 20,
                                            delay: 0.3
                                        }}
                                        className="flex justify-center mt-4"
                                    >
                                        <Button 
                                            onClick={() => setShowSuccess(true)}
                                            size="lg"
                                        >
                                            OK
                                        </Button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}